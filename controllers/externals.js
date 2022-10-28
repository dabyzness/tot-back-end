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
    unshorten(req, res);
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
      expiresAt: Number(
        website.data
          .split("background-image:url")[1]
          .split(")")[0]
          .split("(")[1]
          .split("expires=")[1]
          .split("&")[0]
      ),
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

async function google(req, res) {
  try {
    const { url } = req.query;

    const data = await axios.get(url);

    // console.log(data);
    const filteredResponse = {};

    const location = url.split("@")[1].split(",");
    filteredResponse.location = {
      latitude: Number(location[0]),
      longitude: Number(location[1]),
    };

    const split = data.data.split("meta");
    split.forEach((line) => {
      if (line.includes("itemprop")) {
        let pulled = line.split('"')[1].split(" · ");

        if (line.includes("name")) {
          filteredResponse.name = pulled[0];
          filteredResponse.address = pulled[1];
        } else if (line.includes("description")) {
          filteredResponse.cuisineType = pulled[1];
        }
      }
    });

    let websiteURL = data.data.match(
      /(http|ftp|https):\/\/([\w]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
    );

    filteredResponse.url = websiteURL.filter((website) => {
      if (
        website.includes("google") ||
        website.includes("ggpht") ||
        website.includes("schema.org") ||
        website.includes("gstatic")
      ) {
        return false;
      }

      return true;
    })[0];

    const number = data.data.match(
      /tel:[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g
    );

    filteredResponse.tel = number[0].slice(4, number[0].length);

    // Picture Links
    let result = data.data.match(
      /(http|ftp|https):\/\/(lh5+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
    );

    let refined = result.reduce((prev, str) => {
      if (str.length < 30) {
        return prev;
      }

      if (prev.includes(str)) {
        return prev;
      }

      prev.push(str);
      return prev;
    }, []);

    const finalPictureArray = [];

    for (let i = 0; i < 5; i += 1) {
      finalPictureArray.push(refined[i]);
    }

    filteredResponse.imgs = finalPictureArray;

    res.status(200).json(filteredResponse);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function scrapeGoogle(url) {
  try {
    const data = await axios.get(url);

    const filteredResponse = {};

    const location = url.split("@")[1].split(",");
    filteredResponse.location = {
      latitude: location[0],
      longitude: location[1],
    };

    const split = data.data.split("meta");
    split.forEach((line) => {
      if (line.includes("itemprop")) {
        let pulled = line.split('"')[1].split(" · ");

        if (line.includes("name")) {
          filteredResponse.name = pulled[0];
          filteredResponse.address = pulled[1];
        } else if (line.includes("description")) {
          filteredResponse.cuisineType = [pulled[1]];
        }
      }
    });

    let websiteURL = data.data.match(
      /(http|ftp|https):\/\/([\w]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
    );

    filteredResponse.website = websiteURL.filter((website) => {
      if (
        website.includes("google") ||
        website.includes("ggpht") ||
        website.includes("schema.org") ||
        website.includes("gstatic")
      ) {
        return false;
      }

      return true;
    })[0];

    const number = data.data.match(
      /tel:[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g
    );

    filteredResponse.tel = number ? number[0].slice(4, number[0].length) : "0";

    // Picture Links
    let result = data.data.match(
      /(http|ftp|https):\/\/(lh5+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
    );

    let refined = result.reduce((prev, str) => {
      if (str.length < 30) {
        return prev;
      }

      if (prev.includes(str)) {
        return prev;
      }

      prev.push(str);
      return prev;
    }, []);

    const finalPictureArray = [];

    for (let i = 0; i < 5; i += 1) {
      if (!refined[i]) {
        break;
      }
      finalPictureArray.push(refined[i]);
    }

    filteredResponse.imgs = finalPictureArray;

    return filteredResponse;
  } catch (error) {
    return error;
  }
}

export { unshorten, getDataFromURL, google, scrapeGoogle };
