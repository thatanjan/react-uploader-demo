import React, { useCallback, useState, useEffect } from 'react'
import { Box, Text, Image as ChakraImage, Button } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const Uploader = () => {
	const [file, setFile] = useState({})

	const setFileState = (data) => setFile((p) => ({ ...p, ...data }))

	const handleSubmit = async () => {
		try {
			const { base64, height, width } = file

			const url = 'http://localhost:8000/upload'

			const { data } = await axios.post(url, {
				src: base64,
				height,
				width,
			})

			console.log(data)
		} catch (error) {
			console.log(error.response.data.message)
		}
	}

	const onDrop = useCallback((acceptedFiles) => {
		const fileObject = acceptedFiles[0]
		console.log(fileObject)

		const preview = URL.createObjectURL(fileObject)
		setFileState({ fileObject, preview })
		// Do something with the files

		const image = new Image()

		image.src = preview

		image.onload = () =>
			setFileState({
				width: image.width,
				height: image.height,
			})

		const reader = new FileReader()

		reader.onabort = () => console.log('file reading was aborted')

		reader.onerror = () => console.log('file reading has failed')

		reader.readAsDataURL(fileObject)

		reader.onload = () => setFileState({ base64: reader.result })
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: {
			'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
		},
	})

	useEffect(() => () => URL.revokeObjectURL(file.preview), [file.preview])

	return (
		<Box m='0 auto' maxW='50rem' w='80%'>
			{file.preview ? (
				<ChakraImage src={file.preview} alt='' w='100%' />
			) : (
				<Box
					display='grid'
					placeItems='center'
					minH='15rem'
					border='1px dashed black'
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					<Text>
						{isDragActive
							? 'Release to drop the files here'
							: "Drag 'n' drop some files here, or click to select files"}
					</Text>
				</Box>
			)}

			<Button onClick={() => setFile({})}>Reset</Button>
			<Button onClick={handleSubmit}>Submit</Button>
		</Box>
	)
}

export default Uploader
