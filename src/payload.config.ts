import { buildConfig } from 'payload/config'
import dotenv from 'dotenv'
import path from 'path'
import Blog from './collections/Blog'
import Users from './collections/Users'
import Media from './collections/Media'
import Pages from './collections/Pages'
import Submissions from './collections/Submissions'
import Build from './globals/Build'
import Navigation from './globals/Navigation'
import Seo from './globals/Seo'
import SocialMedia from './globals/SocialMedia'
import ContactInfo from './globals/ContactInfo'
import Footer from './globals/Footer'

dotenv.config()

if (process.env.NODE_ENV === 'production ' && !process.env.BUILD_WEBHOOK_URL) {
	throw new Error(
		`[env] BUILD_WEBHOOK_URL is not defined. Received: ${process.env.BUILD_WEBHOOK_URL}`
	)
}

// Because we are using serve modules within the admin page webpack, it will
// throw errors so we have to alias it with an empty object.
const uploadFilePath = path.resolve(__dirname, 'lib', 'aws.ts')

export default buildConfig({
	/**
	 * If in development, use a set URL. In production, if the server url is set,
	 * then we use that and append the port otherwise, we leave undefined.
	 */
	serverURL:
		process.env.NODE_ENV !== 'production'
			? 'http://localhost:4000'
			: process.env.PAYLOAD_PUBLIC_SERVER_URL || undefined,
	admin: {
		user: Users.slug,
		webpack: (config) => ({
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve.alias,
					[uploadFilePath]: false,
				},
			},
		}),
	},
	collections: [Blog, Users, Media, Pages, Submissions],
	globals: [Build, Navigation, ContactInfo, Seo, SocialMedia, Footer],
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
