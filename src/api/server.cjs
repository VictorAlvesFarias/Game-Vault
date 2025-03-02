const express = require("express");
var cors = require('cors');
const saveService = require("./services/save-service.cjs");
const app = express();

app.use(cors());
app.use(express.json());

function server() {

    app.post('/add', async (req, res) => {
        const { savePathOrigin, name } = req.body;
        try {
            const response = await saveService.add(savePathOrigin, name);

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.get('/get-documents', async (req, res) => {
        try {
            const response = await saveService.get();

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.get('/get/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const documents = saveService.document();
            const save = documents.data.find(e => e.id == id);

            if (!save) {
                return res.status(400).json({ success: false, error: 'Save not found' });
            }

            res.status(200).json({ success: true, data: save });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.delete('/delete/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const response = await saveService.delete(id);

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.post('/sync/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const response = await saveService.sync(id);

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.put('/update/:id', async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        try {
            const response = await saveService.update(id, data);

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.post('/set-watcher', (req, res) => {
        const { folderPath } = req.body;
        const callback = (event) => {
            console.log(`Folder ${folderPath} changed: ${event}`);
        };

        try {
            const response = saveService.setWatcherEvent(folderPath, callback);

            if (!response.success) {
                return res.status(400).json(response);
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

}

module.exports = server;