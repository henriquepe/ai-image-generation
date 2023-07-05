import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const object = req.body.object || "";
  const place = req.body.place || "";
  const placeTone = req.body.placeTone || "";
  const lighting = req.body.lighting || "";

  if (
    object.trim().length === 0 ||
    place.trim().length === 0 ||
    placeTone.trim().length === 0 ||
    lighting.trim().length === 0
  ) {
    res.status(400).json({
      error: {
        message: "Todas as informações devem ser fornecidas.",
      },
    });
    return;
  }

  try {
    /*
      An aquarium against one wall. 
      The wall should have a light gray tone. 
      The lighting for this scene should be like a center light.
    */

    const response = await openai.createImage({
      prompt: `
      Um(a) ${object} encostado ou em ${place}.
      O(a) ${place} deve ter um tom de ${placeTone}.
      A iluminação desse cenário deve ser como ${lighting}
      `,
      n: 5,
      size: "1024x1024",
    });
    console.log("response", response.data);
    // const image_url = response.data.data[0].url;
    // const image_url = response.data;
    const images = response.data.data.map((item) => item.url);
    res.status(200).json({
      result: images,
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
