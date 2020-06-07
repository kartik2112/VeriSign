from flask import Flask, render_template, request
import cv2
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Lambda, Conv2D, MaxPooling2D, BatchNormalization, Dense, Flatten, Activation, Dropout
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras import backend as K
from tensorflow.python.keras.backend import set_session

app = Flask(__name__)
cors = CORS(app)

def calcResizedShape(shape,maxW,maxH):
  '''
  shape of cv2 image is height x width
  But cv2.resize expects width x height -_-
  '''
  if shape[0] > shape[1]:
    return (int(maxH / shape[0] * shape[1]), maxH)
  else:
    return (maxW, int(maxW / shape[1] * shape[0]))

def calcPaddingWidths(shape):
  '''
  returns top, bottom, left, right padding widths
  '''
  if shape[0] > shape[1]:
    return (0, 0, (shape[0] - shape[1]) // 2, (shape[0] - shape[1] + 1) // 2)
  else:
    return ((shape[1] - shape[0]) // 2, (shape[1] - shape[0] + 1) // 2, 0, 0)

def adjustImage(image):
    extra_pad = 8
    img1 = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    img1 = cv2.resize(img1,calcResizedShape(img1.shape,224-extra_pad,224-extra_pad))
    top,bottom,left,right = calcPaddingWidths(img1.shape)
    color = np.argmax(cv2.calcHist([img1],[0],None,[256],[0,256]))
    return cv2.copyMakeBorder(img1,top+extra_pad//2,bottom+extra_pad//2,left+extra_pad//2,right+extra_pad//2,cv2.BORDER_CONSTANT,value=int(color))


@app.route('/verifySign', methods=['POST'])
def my_link():
    # print(request.files)
    img1 = np.fromstring(request.files['img1'].read(), np.uint8)
    img1 = cv2.imdecode(img1, cv2.IMREAD_COLOR)

    img2 = np.fromstring(request.files['img2'].read(), np.uint8)
    img2 = cv2.imdecode(img2, cv2.IMREAD_COLOR)

    # img1 = cv2.imread(img1)
    # cv2.imshow('Received Image',img)
    print(img1.shape)
    print(img2.shape)
    # cv2.waitKey(0)  
    # set_session(sess)
    # with graph.as_default():
    # model = tf.keras.models.load_model('../signature-siamese-97Perc-Validatn-Unaugmented_6 June 2020.h5')
    model = tf.keras.models.load_model('./Trained Models/signature-siamese-96Perc-Validatn-Unaugmented.h5')
    y = model.predict([adjustImage(img1).reshape(1,224,224,1)/255., adjustImage(img2).reshape(1,224,224,1)/255.])
    return str(float(y))

# @app.route('/verify-silatra-server/')
# def my_link():
#     return "Connected to Silatra Server"

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host = '0.0.0.0')