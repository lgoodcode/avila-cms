# [View Live](https://avila-cms.herokuapp.com)

## [View Front-End](https://avilacare.netlify.app)
# Installation

To install the dependencies with ESLint and Prettier, you will need to
run `npm install --legacy-peer-deps`. This is because the payload module
has conflicts with the new versions as dependencies of other modules.
If the newer ones are installed it will break the admin page build.

# Deployment

The `BUILD_WEBHOOK_URL` is used to send the request to the front-end
server and rebuild. This is only required for SSG sites and can be
modified in the `lib/triggerBuild.ts` file.

Install with `npm install --legacy-peer-deps` prior to building. It is
currently hosted on [Render](Render.com), which allows you to specify the
commands. 

## IMPORTANT

The following steps are for deployment to Heroku.

The CMS is hosted on Heroku. To allow it to work in Heroku, we have to
modify the install step because it will install the new dependencies
which will break the admin page.

We use the `heroku-postbuild` script will run instead of the default
`npm run build`. Within the script, we install the modules again with
the `--legacy-peer-deps` flag. Followed by that, we run the build
script and the CMS is ready to be used.

## Dependencies

`cross-env` and `typescript` need to be moved as a dependency from devDependency
to allow them to be used during the build process.

## **Important**

Because of using the `--legacy-peer-deps` flag, the `package.json` and
`package-lock` will not be in sync and cause the build to fail because
of `npm ci`. To get around this, we specify the `USE_NPM_INSTALL=true`
environment variable.

Also, 

## Environment Variables

The following environment variables will need to be configured on the
platform hosting the CMS:

- `PAYLOAD_SECRET`
- `MONGODB_URI`
- `BUILD_WEBHOOK_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET`
- `PAYLOAD_PUBLIC_AWS_PUBLIC_URL`
- `PAYLOAD_PUBLIC_SERVER_URL` *[optional (just used to display the URL when starting up)]*

# Images

Images are hosted on Amazon S3.

It requires multiple environment variables for the connection. It uses a hook to
upload images to S3 and then retrieves them from there. Same goes for the thumbnails.

## **Important**

Because Payload uses Webpack to bundle and the `aws-sdk` uses NodeJS modules such as
`fs` and `utils`, it will throw errors because they are not available in the browser.
So we modify the `payload.config.ts` webpack property under `admin`. We simply just
have to get the path of the file that will be using NodeJS modules and set the alias
resolve to false to ignore it. We have to use the path to the file because it is not
an npm package that is imported.

# Details

Contains a lot of default boilerplate that can be used for multiple
websites and quickly modified to meet the specific needs.

Extended Payload types for globals and collections config to require the
access property to be set to ensure security and prevent unwanted
access or modifications.

Added fields directory within blocks to allow block fields to use
default fields in addition to blocks.

Contains a collection to contain form-submissions. Future-proofed by
adding a source field to identify origin so that if there are different
types of submissions, they can be identified and/or separated.

Added custom hooks to use a custom id generation function for more a
unique id than the default.

Added custom fields `LastModifiedBy` and `CreatedBy` which have hooks
already included and can be added to any collection for extra data.

Added a hook to users collection to enforce password strength by since
there is no way to modify the actual inputs or proper validation api. It
will display a "no password given" error. This is because if it doesn't
meet the complexity requirements, we set the password to an empty string
otherwise, it will create the account, even if the password is a single
character.

Set `maxDepth` on the Link field to 0 to prevent circular structures because
it will return the entire document of the resource it is related to in
a query. In this case, we only want the slug of the page it is related to
and nothing more so we can safely disable depth here.

Seperate environment variable for development.\
*Note: the `generate:types` will not run without detecting the* 
*`PAYLOAD_SECRET` as well as the server URL and port to be able*
*to run.*

Eslint and Prettier configured (installed using --legacy-peer-deps to
prevent conflicts with Payload dependencies which are breaking).

Default roles of user, admin, and superuser with constants and
types for access control.

# Config

GraphQL is disabled.

# Types

The generated types as-is is available at `src/types/payload.d.ts`

## Modified Types

A script `src/lib/fixTypes.ts` is used with a custom npm script `fix:types` and
`types` to streamline creating types that require changes on every generation.

`fix:types` runs the script where any hard-coded changes can be set.

`types` runs the default `generate:types` script to build the types and then the
custom script to modify it.

The script includes a call to `prettier --write` the type file to format it.

## Changed Types

For the frontend, we modify the `image` object from type `string | Media` to just
`Media`. This is so it knows that it will be a `Media` object and not a string so
that it'll have the url and other properties needed in typing.

# Blocks and Fields

The blocks directory contains fields but in a block config, so that they may be used
in the section block to allow full customization in choices of components to use.
The directory contains an index file to export all of them to easy import in the
section but, doesn't include the hero or section block itself. The hero is unique
to the page collection and would be circular if the section block referenced itself.
