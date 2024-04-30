from flask import Flask, jsonify
#import cv2
import os
# import base64
from PIL import Image
import base64
import io
import numpy as np
from operator import itemgetter

# TODO: change mse to a model based prediction

app = Flask(__name__)

def get_mse(img1, img2):
    # mse = np.square(np.subtract(img1,img2)).mean()
    # return mse

    import cv2
    from skimage import metrics
    # Load images
    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]), interpolation = cv2.INTER_AREA)
    # Calculate SSIM
    ssim_score = metrics.structural_similarity(img1, img2, full=True, multichannel=True)
    #print(f"SSIM Score: ", round(ssim_score[0], 2))
    
    return round(ssim_score[0],3)

def open_image(filename, dims):
    image = Image.open(filename)
    image = image.convert(mode='RGB')
    image = image.resize(dims)
    image_np = np.asarray(image)
    return image_np

def mse_ranks(dir, drawn_img):
    im = Image.fromarray(drawn_img)
    im.save("im.jpeg")
    mse_dict = {}
    for filename in os.listdir(dir):
        f = os.path.join(dir, filename)
        image = open_image(f, (drawn_img.shape[1], drawn_img.shape[0]))
        #im = Image.fromarray(image)
        #im.save(f"im-{filename}.jpeg")
        mse = get_mse(drawn_img, image)
        mse_dict[filename] = mse
    
    res = dict(sorted(mse_dict.items(), key=itemgetter(1), reverse=True)[:5])
    print(res)
    return mse_dict

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/flag/<path:url>", methods=['GET'])
def get_flags(url):
    
    # image_64_decode = base64.b64decode(url)
    # image_result = open('baseimage.jpg', 'wb')
    # image_result.write(image_64_decode)
    # img_rgb = cv2.imread('baseimage.jpg')
    # return img_rgb
    start = "data:image/jpeg;base64,"
    url_end = url[len(start):]
    base64_decoded = base64.b64decode(url_end)# + "=" * (-len(url) % 4))

    image = Image.open(io.BytesIO(base64_decoded))
    #print(image.size)
    image_np = np.asarray(image)
    #print(image_np.shape)

    mses = jsonify(mse_ranks('flags', image_np))
    some_text = 'placeholder' #mses['France']

    return f'<img src="{url}"><p>{some_text}</p>'