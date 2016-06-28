require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片数据

let imagesData = require('json!../data/imagesData.json');

//利用自执行函数将图片信息转换为图片路径
imagesData = ((imagesDataArr)=>{
  for (let imageData of imagesDataArr) {
    imageData.Url = require('../images/' + imageData.fileName);
  }
  return imagesDataArr;
})(imagesData)

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className='img-figure'>
        <img src={this.props.data.Url} />
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}
class AppComponent extends React.Component {
  //初始化状态
  constructor(props) {
    super(props);
    this.state = {
      Constant:{
        centerPos:{
        left:0,
        right:0
      },
      hPosRange:{ //水平取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{ //垂直取值范围
        x:[0,0],
        topY:[0,0]
      }
      }
    }
  }
  //图片排布重置
  rearrange(centerIndex) {

  }
  getInitialStage() {
    return {
      imgsArrangeArr:[
        /*{
          pos:{
            left: '0',
            top: '0'
          }
        }*/
      ]
    }
  }
  componentDidMount() {
    //舞台大小
    let stageDOM=ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.trunc(stageW/2),
        halfStageH = Math.trunc(stageH/2);

    //单独图片figure 大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgFigureW = imgFigureDOM.scrollWidth,
        imgFigureH = imgFigureDOM.scrollHeight,
        halfimgFigureH = Math.trunc(imgFigureH/2),
        halfimgFigureW = Math.trunc(imgFigureW/2);

    //初始化排布取值范围
    this.state.Constant.hPosRange.leftSecX[0] = -halfimgFigureW;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfimgFigureW * 3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfimgFigureW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfimgFigureW;
    this.state.Constant.hPosRange.y[0] = -halfimgFigureH;
    this.state.Constant.hPosRange.y[1] = stageH - halfimgFigureH;
    this.state.Constant.vPosRange.topY[0] = -halfimgFigureH;
    this.state.Constant.vPosRange.topY[1] = halfStageH -halfimgFigureH * 3;
    this.state.Constant.vPosRange.x[0] = halfStageW - halfimgFigureW;
    this.state.Constant.vPosRange.x[1] = halfimgFigureW;

    this.rearrange(0);
  }
  render() {
    let controllerUnits = [],
        ImgFigures = [];
    /*for(let [idx,item] of imagesData.entries()){
      ImgFigures.push(<ImgFigure key={idx} ref={'imgFigure'+idx} data={item} />);
    }*/
    imagesData.forEach(function(idx,item){
      /*if(!this.state.imgsArrangeArr[idx]){
        this.stae.imgsArrangeArr[idx] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }*/
      ImgFigures.push(<ImgFigure key={idx} ref={'imgFigure'+idx} data={item} />);
    }/*.bind(this)*/);

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
