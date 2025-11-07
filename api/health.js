export default function handler(req, res) {
  // Simple health endpoint for Vercel serverless
  res.status(200).send("ok");
}
