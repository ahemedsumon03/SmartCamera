import React, {Component,Fragment} from 'react';
import {Container,Col,Row} from "react-bootstrap";
import imagePlaceHolder from '../Assets/Images/imagePlaceholder.svg';
import Webcam from 'react-webcam';
import ReactJson from 'react-json-view';
import * as faceapi from 'face-api.js';
import Loader from "./Loader";

class Camera extends Component {

    constructor() {
        super();
        this.cameraRef = React.createRef();
        this.state = {
            imagePreview:imagePlaceHolder,
            ageAndGenderResult:[],
            faceExpression:[],
            faceLandMark:[],
            loader:'d-none',
            mainDiv:'',
            age:'',
            gender:'',
            expression:'',
            left_to_right_eye:'0',
            left_eye_to_nose:'0',
            right_eye_to_nose:'0',
            nose_to_left_mouth:'0',
            nose_to_right_mouth:'0'
        }
    }

    capturePhoto=()=>{
        let base64photo =this.cameraRef.current.getScreenshot();
        this.setState({imagePreview:base64photo})
    }

    onSave=()=>{
        let base64photo = this.state.imagePreview;
        let a = document.createElement("a");
        a.href = base64photo;
        a.download = "WebImage.png"
        a.click();
    }

    ageAndGenderRec=()=>{
        (async ()=>{
             this.setState({loader:''})
             await faceapi.nets.ssdMobilenetv1.loadFromUri('models/');
             await faceapi.nets.ageGenderNet.loadFromUri('models/');
             let myImage = document.querySelector('img');
             let result= await faceapi.predictAgeAndGender(myImage);
             let myage = parseInt(result['age']);
             let myGender = result['gender'];
             this.setState({
                 age:myage,
                 gender:myGender
             })
             this.setState({ageAndGenderResult:result})
             this.setState({loader:'d-none'})
             console.log(result);
        })()
    }

    FaceExpressionRec=()=>{
        (async ()=>{
            this.setState({loader:''})
            await faceapi.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceapi.nets.faceExpressionNet.loadFromUri('models/');
            let Image = document.querySelector('img');
            let result = await faceapi.recognizeFaceExpressions(Image);
            this.setState({faceExpression:result})
            let neutral = result['neutral'];
            let happy = result['happy'];
            let sad = result['sad'];
            let angry = result['angry'];
            let fearful = result['fearful'];
            let disgusted = result['disgusted'];
            let surprised = result['surprised'];

            if(neutral>0.5 && neutral<1.1)
            {
                this.setState({expression:"neutral"})
            }
            else if(happy>0.5 && happy<1.1)
            {
                this.setState({expression:"happy"})
            }
            else if(sad>0.5 && sad<1.1)
            {
                this.setState({expression:"sad"})
            }
            else if(angry>0.5 && angry<1.1)
            {
                this.setState({expression:"angry"})
            }
            else if(fearful>0.5 && fearful<1.1)
            {
                this.setState({expression:"fearful"})
            }
            else if(disgusted>0.5 && disgusted<1.1)
            {
                this.setState({expression:"disgusted"})
            }
            else if(surprised>0.5 && surprised<1.1)
            {
                this.setState({expression:"surprised"})
            }
            this.setState({loader:'d-none'})
            console.log(result);

        })()
    }

    FaceLandMarkRec=()=>{
        (async ()=>{
            this.setState({loader:''})
            await faceapi.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceapi.nets.faceLandmark68Net.loadFromUri('models/');
            let myImage = document.querySelector('img');
            let result= await faceapi.detectFaceLandmarks(myImage);
            this.setState({faceLandMark:result})
            this.setState({loader:'d-none'})
            console.log(result);
        })()
    }


    Left_to_right_eye=()=>{

        let facelandMark = this.state.faceLandMark;
        let x1 = facelandMark['_positions'][37]['_x'];
        let x2 = facelandMark['_positions'][37]['_y'];
        let y1 = facelandMark['_positions'][46]['_x'];
        let y2 = facelandMark['_positions'][46]['_y'];
        let distance = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        this.setState({left_to_right_eye:distance})
    }

    Left_eye_to_nose=()=>{
        let facelandMark = this.state.faceLandMark;
        let x1 = facelandMark['_positions'][37]['_x'];
        let x2 = facelandMark['_positions'][37]['_y'];
        let y1 = facelandMark['_positions'][31]['_x'];
        let y2 = facelandMark['_positions'][31]['_y'];
        let distance = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        this.setState({left_eye_to_nose:distance})
    }

    Right_eye_to_nose=()=>{
        let facelandMark = this.state.faceLandMark;
        let x1 = facelandMark['_positions'][46]['_x'];
        let x2 = facelandMark['_positions'][46]['_y'];
        let y1 = facelandMark['_positions'][31]['_x'];
        let y2 = facelandMark['_positions'][31]['_y'];
        let distance = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        this.setState({right_eye_to_nose:distance})
    }

    Nose_to_left_mouth=()=>{
        let facelandMark = this.state.faceLandMark;
        let x1 = facelandMark['_positions'][31]['_x'];
        let x2 = facelandMark['_positions'][31]['_y'];
        let y1 = facelandMark['_positions'][49]['_x'];
        let y2 = facelandMark['_positions'][49]['_y'];
        let distance = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        this.setState({nose_to_left_mouth:distance})
    }

    Nose_to_right_mouth = ()=>{
        let facelandMark = this.state.faceLandMark;
        let x1 = facelandMark['_positions'][31]['_x'];
        let x2 = facelandMark['_positions'][31]['_y'];
        let y1 = facelandMark['_positions'][55]['_x'];
        let y2 = facelandMark['_positions'][55]['_y'];
        let distance = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        this.setState({nose_to_right_mouth:distance})
    }

    render() {

        return (
            <Fragment>
                <div className={this.state.mainDiv}>
                    <Container>
                        <Row className='p-4 shadow-sm'>
                            <Col sm={12} md={4} lg={4} className='p-2'>
                                <Webcam
                                    ref={this.cameraRef}
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    className='img-fluid'
                                />
                                <button onClick={this.capturePhoto} className='btn btn-primary side mt-3'>Capture</button>
                            </Col>

                            <Col sm={12} md={4} lg={4} className='p-2'>
                                <img  className='shadow-sm img-fluid bg-dark' src={this.state.imagePreview} alt=''/>
                                <button onClick={this.onSave} className='btn btn-primary side mt-3'>Save</button>
                            </Col>
                            <Col sm={12} md={4} lg={4} className='p-2'>
                                <p>Age: <span className='text-danger'>{this.state.age}</span></p>
                                <p>Gender: <span className='text-danger'>{this.state.gender}</span></p>
                                <p>Expression: <span className='text-danger'>{this.state.expression}</span></p>
                                <p>left_to_right_eye: <span className='text-danger'>{this.state.left_to_right_eye}</span></p>
                                <p>left_eye_to_nose: <span className='text-danger'>{this.state.left_eye_to_nose}</span></p>
                                <p>right_eye_to_nose: <span className='text-danger'>{this.state.right_eye_to_nose}</span></p>
                                <p>nose_to_left_mouth: <span className='text-danger'>{this.state.nose_to_left_mouth}</span></p>
                                <p>nose_to_right_mouth: <span className='text-danger'>{this.state.nose_to_right_mouth}</span></p>
                            </Col>
                        </Row>
                    </Container>

                    <Container className='mt-2'>

                        <Row className='p-4 shadow-sm'>

                            <Col className='p-2' sm={12} md={3} lg={3}>
                                <p>Left_to_Right_eye: {this.state.left_to_right_eye}</p>
                                <button onClick={this.Left_to_right_eye} className='btn btn-warning'>Left_to_Right_eye</button>
                            </Col>

                            <Col className='p-2' sm={12} md={3} lg={3}>
                                <p>Left_eye_to_nose: {this.state.left_eye_to_nose}</p>
                                <button onClick={this.Left_eye_to_nose} className='btn btn-warning'>Left_eye_to_nose</button>
                            </Col>

                            <Col className='p-2' sm={12} md={3} lg={3}>
                                <p>Right_eye_to_nose: {this.state.right_eye_to_nose}</p>
                                <button onClick={this.Right_eye_to_nose} className='btn btn-warning'>Right_eye_to_nose</button>
                            </Col>

                            <Col className='p-2' sm={12} md={3} lg={3}>
                                <p>Nose_to_left_mouth: {this.state.nose_to_left_mouth}</p>
                                <button onClick={this.Nose_to_left_mouth} className='btn btn-warning'>Nose_to_left_mouth</button>
                            </Col>

                            <Col className='p-2' sm={12} md={3} lg={3}>
                                <p>Nose_to_right_mouth: {this.state.nose_to_right_mouth}</p>
                                <button onClick={this.Nose_to_right_mouth} className='btn btn-warning'>Nose_to_right_mouth</button>
                            </Col>

                        </Row>

                    </Container>

                    <Container>
                        <Row className='mt-2'>
                            <Col className='p-2' sm={12} md={6} lg={6}>
                                <h6>Face Landmark </h6>
                                <ReactJson src={this.state.faceLandMark} />
                                <button onClick={this.FaceLandMarkRec} className='btn btn-warning'>Get Result</button>
                            </Col>
                            <Col className='p-2' sm={12} md={6} lg={6}>
                                <h6>Face Expression </h6>
                                <ReactJson src={this.state.faceExpression} />
                                <button onClick={this.FaceExpressionRec} className='btn btn-warning'>Get Result</button>
                            </Col>
                            <Col className='p-2' sm={12} md={6} lg={6}>
                                <h6>Age and Gender Detection </h6>
                                <ReactJson src={this.state.ageAndGenderResult} />
                                <button onClick={this.ageAndGenderRec} className='btn btn-warning'>Get Result</button>
                            </Col>
                        </Row>
                    </Container>
                </div>
               <div className={this.state.loader}>
                   <Loader/>
               </div>
            </Fragment>
        );
    }
}

export default Camera;