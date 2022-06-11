import { buildConfig } from 'payload/config'
import dotenv from 'dotenv'
import path from 'path'
import Blog from './collections/Blog'
import Users from './collections/Users'
import Media from './collections/Media'
import Pages from './collections/Pages'
import Submissions from './collections/Submissions'
import Navigation from './globals/Navigation'
import Seo from './globals/Seo'
import SocialMedia from './globals/SocialMedia'
import ContactInfo from './globals/ContactInfo'
import Footer from './globals/Footer'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

if (isProd && !process.env.PAYLOAD_PUBLIC_SERVER_URL) {
	throw new Error('[env] PAYLOAD_PUBLIC_SERVER_URL is not defined')
}

if (isProd && !process.env.PAYLOAD_PUBLIC_PORT) {
	throw new Error('[env] PAYLOAD_PUBLIC_PORT is not defined')
}

export default buildConfig({
	serverURL: isProd
		? `${process.env.PAYLOAD_PUBLIC_SERVER_URL}:${process.env.PAYLOAD_PUBLIC_PORT}`
		: 'http://localhost:4000',
	admin: {
		user: Users.slug,
	},
	collections: [Blog, Users, Media, Pages, Submissions],
	globals: [Navigation, ContactInfo, Seo, SocialMedia, Footer],
	maxDepth: 5,
	rateLimit: {
		max: 500,
	},
	// Whitelist of domains to allow cookie auth from
	// csrf: [
	// 	'https://domain.com'
	// ],
	typescript: {
		outputFile: path.resolve(__dirname, 'types', 'payload-types.ts'),
	},
	graphQL: {
		disable: true,
	},
})
