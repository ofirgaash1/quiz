import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
export async function POST(request) {
  // const body = await request.json();  // body is declared but its value is never read
 
  try {
    const jsonResponse = await handleUpload({
      onBeforeGenerateToken: async (/* pathname, clientPayload */) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        // Parameters:
        // - pathname: The path of the file being uploaded (currently unused)
        // - clientPayload: Additional payload from the client (currently unused)
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        return {
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        /**
         * Function to handle actions after the upload is completed.
         * @param {Object} param0 - The object containing blob and tokenPayload.
         * @param {Object} param0.blob - The uploaded blob object.
         * @param {string} param0.tokenPayload - The token payload as a string.
         */
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          // Get notified of client upload completion
          // ⚠️ This will not work on `localhost` websites,
          // Use ngrok or similar to get the full upload flow
   
          console.log('blob upload completed', blob, tokenPayload);
   
          try {
            // Run any logic after the file upload completed
            // const { userId } = JSON.parse(tokenPayload);
            // await db.update({ avatar: blob.url, userId });
          } catch (error) {
            throw new Error('Could not update user');
          }
        },
      }}
   });
    
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }, // The webhook will retry 5 times waiting for a status 200
    );
  }
}