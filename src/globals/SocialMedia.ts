import { GlobalConfig } from '../types/payload'
import { defaultGlobalAccess } from '../lib/accessControl'
import Link from '../fields/Link'
import LastModifiedBy from '../fields/LastModifiedBy'

const SocialMedia: GlobalConfig = {
	slug: 'social-media',
	label: 'Social Media',
	access: defaultGlobalAccess,
	fields: [
		LastModifiedBy,
		{
			name: 'links',
			type: 'array',
			labels: {
				singular: 'Link',
				plural: 'Links',
			},
			fields: [Link('url')],
		},
	],
}

export default SocialMedia
