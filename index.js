import express from "express"

const app = express()
const PORT = process.env.PORT || 3000

const TARGET = "http://212.132.120.102:12115"

app.get("/ping", async (req, res) => {
  try {
    const start = Date.now()
    await fetch(`${TARGET}/ping`)
    const latency = Date.now() - start

    res.json({ status: "online", latency })
  } catch (err) {
    res.status(500).json({ status: "offline", error: err.message })
  }
})

app.get("/v4/stats", async (req, res) => {
  try {
    const response = await fetch(`${TARGET}/v4/stats`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${TARGET}/health`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ status: "offline" })
  }
})

app.listen(PORT, () => {
  console.log("Server running")
})
