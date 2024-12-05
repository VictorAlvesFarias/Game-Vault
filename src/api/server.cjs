const express = require("express");
var cors = require('cors')
const saveService = require("./services/save-service.cjs");
const app = express();
const WebSocket = require('ws');
let sockets = [];
const ws = new WebSocket.Server({ port: 2526 });

app.use(cors())
app.use(express.json())

function server() {

    app.post('/add', async (req, res) => {
        const { savePathOrigin, name } = req.body;
        try {
            await saveService.add(savePathOrigin, name);
            res.status(201).json({ message: 'Save added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/get-documents', async (req, res) => {
        try {
            const documents = await saveService.get();

            documents.forEach(item => {
                saveService.setWatcherEvent(item.savePathOrigin, () => {
                    sockets.forEach((s) => {
                        const saveItem = saveService.getById(item.id)

                        if (saveItem.saveWithRachChange) {
                            saveService.sync(saveItem.id)
                        }
                        else {
                            s.send(JSON.stringify({ type: "unsync-dir", saveItem: saveItem }))
                        }
                    })
                })
            })

            res.json(documents);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/get/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const save = saveService.getById(id);
            if (!save) {
                return res.status(404).json({ error: 'Save not found' });
            }
            res.json(save);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.delete('/delete/:id', async (req, res) => {
        const { id } = req.params;
        console.log(id)
        try {
            const updatedContext = await saveService.delete(id);
            res.json(updatedContext);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/sync/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const updatedSave = await saveService.sync(id);
            res.json(updatedSave);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.put('/update/:id', async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        try {
            const updatedSave = await saveService.update(id, data);
            if (!updatedSave) {
                return res.status(404).json({ error: 'Save not found' });
            }
            console.log(updatedSave)
            res.json(updatedSave);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/set-watcher', (req, res) => {
        const { folderPath } = req.body;
        const callback = (event) => {
            console.log(`Folder ${folderPath} changed: ${event}`);
        };

        try {
            saveService.setWatcherEvent(folderPath, callback);
            res.status(200).json({ message: 'Watcher set successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

    ws.on('connection', (socket) => {
        sockets.push(socket);

        socket.on('close', () => {
            sockets = sockets.filter(s => s !== socket);
        });
    });
}

module.exports = server;
