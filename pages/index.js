import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [sceneState, setSceneState] = useState({
    object: "",
    place: "",
    placeTone: "",
    lighting: "",
  });
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generateCompletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sceneState),
      });
      const data = await response.json();
      console.log("data", data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setSceneState({
        object: "",
        place: "",
        lighting: "",
        placeTone: "",
      });
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/baby-boy.png" />
      </Head>

      <main className={styles.main}>
        {/* <img src="/baby-boy.png" className={styles.icon} /> */}
        <h3>Descreva o cenário que a IA deve gerar:</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="object"
            placeholder="Digite o objeto que deseja exibir no cenário. Ex: armário com livros"
            value={sceneState.object}
            onChange={(e) =>
              setSceneState((prev) => ({
                ...prev,
                object: e.target.value,
              }))
            }
          />
          <input
            type="text"
            name="place"
            placeholder="Digite onde esse objeto deve estar no cenário. Ex: parede."
            value={sceneState.place}
            onChange={(e) =>
              setSceneState((prev) => ({
                ...prev,
                place: e.target.value,
              }))
            }
          />
          <input
            type="text"
            name="placeTone"
            placeholder="Digite o tom de cor do lugar comentado acima. Ex: cinza."
            value={sceneState.placeTone}
            onChange={(e) =>
              setSceneState((prev) => ({
                ...prev,
                placeTone: e.target.value,
              }))
            }
          />
          <input
            type="text"
            name="lighting"
            placeholder="Digite como deve ser a iluminação do cenário. Ex: luz de centro"
            value={sceneState.lighting}
            onChange={(e) =>
              setSceneState((prev) => ({
                ...prev,
                lighting: e.target.value,
              }))
            }
          />
          <input type="submit" value="Gerar imagem." />
        </form>
        <div className={styles.result}>
          {result.map((item) => (
            <img src={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
