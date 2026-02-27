FES Classifier – Local Setup
================================

This package contains a simple static website that runs a TensorFlow.js model trained with Google Teachable Machine.

Structure
---------
52675_Pimphapa_Jianwittayakit/
  index.html
  model.html
  about.html
  Description.pdf
  assets/
    css/styles.css
    js/app.js
  model/
    model.json
    metadata.json
    weights.bin   <-- IMPORTANT (not included here unless you provided it)

Running Locally
---------------
1) Place your Teachable Machine weights.bin file into the `model/` folder alongside model.json and metadata.json.
   If you exported your model from Teachable Machine (TensorFlow.js), you will have these three files.

2) Serve the folder via a local HTTP server (required so the browser can fetch model files):
   - Python 3:  cd 52675_Pimphapa_Jianwittayakit && python -m http.server 8000
   - Node.js:   npx http-server -p 8000

3) Open http://localhost:8000 in your browser and use the site.

Notes
-----
* The demo focuses on 3 classes (Fish, Eel, Stingray). If your model also includes an 'Other' class, the UI hides it and only displays the three target classes.
* Images are processed entirely in the browser; no data is uploaded.

Credits
-------
Project ID 52675 · Developer: Pimphapa Jianwittayakit · M.5/13
