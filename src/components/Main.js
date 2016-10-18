require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片数据
let imagesData = require('json!../data/imagesData.json');

imagesData = ((imagesDataArr)=>{
  for (let imageData of imagesDataArr) {
    imageData.Url = require('../images/' + imageData.fileName);
  }
  return imagesDataArr;
})(imagesData)

function getRanNum(min,max){
  return Math.ceil(Math.random()*(max-min)+min);
}

//单张图片组件
class ImgFigure extends React.Component {
  render() {
    let styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos
    }
    return (
      <figure className='img-figure' style={styleObj}>
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
      imgsArrangeArr:[
        /*{
          pos:{
            left: '0',
            top: '0'
          }
        }*/
      ],
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
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.state.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX =  hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random()*2), //顶部取一个或者不取
        topImgSpliceIndex = 0,//标记上侧图片是从数组的哪个取出
        imgsArrangeCenterArr =imgsArrangeArr.splice(centerIndex,1);

        //首先居中index图片
        imgsArrangeCenterArr[0].pos = centerPos;

        topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index].pos = {
            top:getRanNum(vPosRangeTopY[0],vPosRangeTopY[1]),
            left:getRanNum(vPosRangeX[0],vPosRangeX[1])
          }
        });
        //布局左右两侧图片
        for(let i=0,l=imgsArrangeArr.length,j=l/2;i<l;i++){
          let hPosRangeLoRX= null;
          if(i<j){
            hPosRangeLoRX = hPosRangeLeftSecX;
          }else{
            hPosRangeLoRX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i].pos ={
            top:getRanNum(hPosRangeY[0],hPosRangeY[1]),
            left:getRanNum(hPosRangeLoRX[0],hPosRangeLoRX[1])
          }
        }
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        //设置状态,触发Component的重新渲染
        this.setState({
          imgsArrangeArr : imgsArrangeArr
        })


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

    this.state.Constant.centerPos = {
      left:halfStageW - halfimgFigureW,
      top:halfStageH - halfimgFigureH
    }
    //初始化排布取值范围
    this.state.Constant.hPosRange.leftSecX[0] = -halfimgFigureW;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfimgFigureW * 3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfimgFigureW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfimgFigureW;
    this.state.Constant.hPosRange.y[0] = -halfimgFigureH;
    this.state.Constant.hPosRange.y[1] = stageH - halfimgFigureH;

    this.state.Constant.vPosRange.topY[0] = -halfimgFigureH;
    this.state.Constant.vPosRange.topY[1] = halfStageH -halfimgFigureH * 3;
    this.state.Constant.vPosRange.x[0] = halfStageW - imgFigureW;
    this.state.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render(){
    let controllerUnits = [],
        ImgFigures = [];
    imagesData.forEach(function(item,idx){
      if(!this.state.imgsArrangeArr[idx]){
      this.state.imgsArrangeArr[idx] = {
        pos:{
          left:0,
          top:0
        }
      }
    }
      ImgFigures.push(<ImgFigure key={idx} ref={'imgFigure'+idx} data={item} arrange={this.state.imgsArrangeArr[idx]} />);
    }.bind(this))
    return(
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
