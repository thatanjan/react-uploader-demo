import fastify from 'fastify'
import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import fastifyCors from '@fastify/cors'

config()

const app = fastify({
	logger: true,
	bodyLimit: 52428800,
})

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.register(fastifyCors)

app.post('/upload', async (request, reply) => {
	try {
		const { src, height, width } = request.body

		const folder = '/react-uploader-yt'

		const imageConfig = {
			width,
			height,
			crop: 'fit',
			quality: 80,
			folder,
		}

		const uploadRes = await cloudinary.uploader.upload(src, imageConfig)

		return { success: true, data: uploadRes }
	} catch (error) {
		const message = error.message
		return reply.status(400).send({ success: false, message: message })
	}
})

const PORT = process.env.PORT || 8000

app.listen({ port: PORT }).catch((err) => app.log.error(err))
