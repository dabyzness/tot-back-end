import axios from "axios";

/**
 * Unshortens a URL into its original URL and scrapes the HTML
 * @param {*} req Accepts 1 query param --> shortURL
 * @param {*} res Responds with a status code and a JSON object
 */
async function unshorten(req, res) {
  try {
    const { shortURL } = req.query;

    const website = await axios.get(`${shortURL}`);

    const data = {
      url: `https://www.tiktok.com${website.request?.path}`,
      staticImg: `${
        website.data
          .split("background-image:url")[1]
          .split(")")[0]
          .split("(")[1]
      }`,
      likes: `${
        website.data.split("description")[1].split('"')[2].split(" ")[0]
      }`,
      comments: `${
        website.data.split("description")[1].split('"')[2].split(" ")[2]
      }`,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function getDataFromURL(shortURL, count = 0) {
  try {
    const website = await axios.get(`${shortURL}`);

    const data = {
      url: `https://www.tiktok.com${website.request?.path}`,
      staticImg: `${
        website.data
          .split("background-image:url")[1]
          .split(")")[0]
          .split("(")[1]
      }`,
      numLikes: `${
        website.data.split("description")[1].split('"')[2].split(" ")[0]
      }`,
      numComments: `${
        website.data.split("description")[1].split('"')[2].split(" ")[2]
      }`,
    };

    return data;
  } catch (error) {
    if (count === 5) {
      console.log(error);
      return error;
    }
    return getDataFromURL(shortURL, count + 1);
  }
}

export { unshorten, getDataFromURL };
