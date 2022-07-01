import { Heading } from '@chakra-ui/react'

import Uploader from './components/Uploader'

const App = () => {
	return (
		<div>
			<Heading fontSize='5xl' align='center' py={20}>
				React Uploader
			</Heading>

			<Uploader />
		</div>
	)
}

export default App
