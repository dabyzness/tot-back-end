import axios from "axios";

/**
 * Unshortens a URL into its original URL by calling on an external API
 * The external API is called Unshorten
 * Docs: https://unshorten.me/api
 * @param {*} req Accepts 1 query param --> shortURL
 * @param {*} res Responds with a status code and a JSON object
 * Successful response looks like:
 * @key {String} requested_url --> shortURL that was passed in
 * @key {Boolean} success
 * @key {String} resolved_url --> long URL
 * @key {Number} usage_count --> times you've used this service
 * @key {Number} remaining_calls
 */
async function unshorten(req, res) {
  try {
    const { shortURL } = req.query;

    const website = await axios.get(`https://unshorten.me/json/${shortURL}`);
    const data = await website.data;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

export { unshorten };
