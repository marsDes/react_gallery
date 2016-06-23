require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片数据

let imagesData = require('json!../data/imagesData.json');

//利用自执行函数将图片信息转换为图片路径
imagesData = (function getImagesUrl(imagesDataArr){
  for (let imageData of imagesDataArr) {
    imageData.Url = require('../images/' + imageData.fileName);
  }
  return imagesDataArr;
})(imagesData)

console.log(imagesData)
class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
javascript:;