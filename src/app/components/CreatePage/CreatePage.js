import React from 'react'
import { Step, Stepper, StepLabel} from 'material-ui/Stepper'
import { Card, CardHeader,CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ExpandTransition from 'material-ui/internal/ExpandTransition'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import Divider from 'material-ui/Divider'
import {List, ListItem} from 'material-ui/List'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import moment from 'moment'
import HoverDiv from '../HoverDiv'
import ReactTooltip from 'react-tooltip'
import CircularProgress from 'material-ui/CircularProgress'
import ReviewCalendar from '../ReviewCalendar/ReviewCalendar'
import Hints from './Hints'
import ConfirmPage from './ConfirmPage'
import FinishPage from './FinishPage'
import ProjectCode from './ProjectCode'
// API
import axios from 'axios'
import {API_CreateSchedule, API_CheckInstance, API_GetImage} from '../../resource'
//ICON
import ImageViewComfy from 'material-ui/svg-icons/image/view-comfy'
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline'
import ContentRemoveCircleOutline  from 'material-ui/svg-icons/content/remove-circle-outline'
import ActionCheckCircle  from 'material-ui/svg-icons/action/check-circle'
import DeviceStorage from 'material-ui/svg-icons/device/storage'
import CommunicationContactMail from 'material-ui/svg-icons/communication/contact-mail'
// COLOR
import { white, blueA400, blue500, green500, orange500, orangeA700, redA700, greenA700 } from 'material-ui/styles/colors'
import {muiStyle, muiTheme} from '../../myTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// i18n
import { translate, Interpolate } from 'react-i18next'
import i18n from '../../utils/i18n'

const styles = {
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: orange500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: muiStyle.palette.primary1Color,
  },
}

class CreatePage extends React.Component {
  
  constructor(props) {
    super(props)
    console.log('currentInstanceNumthis',this.props.currentInstanceNum)    
    this.state = {
      loading: false,
      finished: false,
      stepIndex: 0,
      submitting: false,
      projectNum: null,
      selectprojectNum:null,
      startDate: new Date(moment().add(1,'day').format('YYYY-MM-DD')),
      endDate: null,
      increaseDay: 0,
      instanceNum: 1,
      queryNumber: 0,
      loadingCreate:false,
      createdRespData: {},
      avalableNumber: [],
      instanceArr: [{ instance: 0, image: 0, imageDesc:''}],
      imageArr: ['Cowboy Bebop','Trigun','Baccano','Chobits','Lupin the third'],
    }
  }
  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    })
  }
  dummyAsync2 = (cb) => {
    this.setState({loadingCreate: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    })
  }
  handleNext = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      if(stepIndex === 2){
          this.setState({ loadingCreate: true})
          this.createApi()
      }else{
        this.dummyAsync(() => this.setState({
          loading: false,
          stepIndex: stepIndex + 1,
          // finished: stepIndex >= 2,
        }))
      }
    }
  }
  createApi = () => {
    console.table(this.state.instanceArr)
    // this.dummyAsync2(() => this.setState({
    //   finished: true,
    // }))
    console.log(this.props.token)
    console.log(moment(this.state.startDate).format('YYYY-MM-DD'))
    console.log(moment(this.state.endDate).format('YYYY-MM-DD'))
    fetch(API_CreateSchedule, 
      { 
        method: 'post', 
        headers: {
          'x-access-token': this.props.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body:JSON.stringify({
          start: moment(this.state.startDate).format('YYYY-MM-DD'),
          end:moment(this.state.endDate).format('YYYY-MM-DD'),
          image_id: this.state.imageArr[this.state.instanceArr[0].image].id
        })
        // body:data
    }).then((response)=>{
      // console.log(response)
      if(response.ok){
        this.dummyAsync2(()=>this.setState({
          // loading: false,
          finished: true,
        }))
      }
      return response.json()
    })
    .then((data)=>{
      console.log(data)
      this.setState({
        createdRespData: data, 
      })        
    }).catch((err)=>{
      console.log('err:'+err)
      this.props.notify('ERROR : Create Schedule')
    })
  }
  getImageApi = () => {
    axios.get(
      API_GetImage,
      {}
    )
    .then((result)=>{      
      this.setState({
        imageArr: result.data.images,        
      })
    }).catch((err)=>{
      console.log(err)
      this.props.notify('ERROR : Image')
    })
  }
  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }))
    }
  }
  handleInstanceNumChange = (event, index, value) => {
    let arr = []
    for(let i = 0; i < value; i++){
      const obj = { 
        instance: this.state.avalableNumber[i].instance, 
        image: 0, 
        imageDesc:this.state.imageArr[0].description}
      arr.push(obj)
    }
    this.setState({
        instanceNum: value,
        instanceArr: arr
    })
  }
  handleChangeStartDate = (event, date) => {    
    this.setState({
      startDate: date,
      increaseDay: moment(this.state.endDate).diff(moment(date), 'days')
    })
    if(this.state.endDate != null)this.checkInstanceRemain()
  }
  handleChangeEndDate = (event, date) => {    
    this.setState({
      endDate: date,
      increaseDay: moment(date).diff(moment(this.state.startDate), 'days')
    })
    this.checkInstanceRemain()
  }
  checkInstanceRemain = () => {
    const {startDate, endDate} = this.state
    axios.get(
      API_CheckInstance,
      {
        headers: {'Accept': 'application/json'},
        params: {
          end: moment(endDate).format('YYYY-MM-DD'),
          start: moment(startDate).format('YYYY-MM-DD')
        }
      }
    )
    .then((result)=>{ 
      let avalableNum = []
      let number
      console.log(result.data)
      if(result.data.avalableNumber <= (3 - this.props.currentInstanceNum)){
        number = result.data.avalableNumber
      }else{
        number = 3 - this.props.currentInstanceNum
      }
      for (let i = 0; i < (number); i++) {
        const obj = {num: i, instance: result.data.machines[i]}
        avalableNum.push(obj)
      }
      this.setState({
        queryNumber: result.data.avalableNumber,
        submitting: false,
        avalableNumber: avalableNum,
        instanceArr:[{ instance: result.data.machines[0], image: 0, imageDesc: this.state.imageArr[0].description}]
      })
      console.log(
        'queryNumber',result.data.avalableNumber, 
        'avalableNumber',avalableNum.length,
        'currentInstanceNum',this.props.currentInstanceNum)
    }).catch((err)=>{
      console.log(err)
      console.log(err.response.data.message)      
      this.props.notify(err.response.data.message)
    })
  }
  handleChangeProjectNum = (event, value) => this.setState({projectNum: value})
  disableStartDate = (date) => (moment(date).isBefore(moment()))
  disableEndDate = (date) => (moment(date).isBefore(moment(this.state.startDate).add(1, 'days')) || moment(date).isAfter(moment(this.state.startDate).add(1, 'month')))
  imageSelect = (instance, index, image) => {
    console.log( instance, index, image)
    // const imageArr = this.state.imageArr
    let instanceArr = this.state.instanceArr
    console.log(instanceArr)
    console.log(this.state.imageArr[image].description)
    instanceArr[instance].image = image
    instanceArr[instance].imageDesc = this.state.imageArr[image].description
    this.setState({
        instanceArr: instanceArr
    }) 
  }
  ChangeProjectNum = (value, selectValue) => {
    this.setState({
      projectNum: value,
      selectprojectNum: selectValue
    })
  }
  getStepContent(stepIndex) {
    const {t} = this.props
    const {submitting, loadingCreate} = this.state
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div style={{margin: '0px auto'}}>
              <div style={{display: 'inline-block'}}>
                <DatePicker
                  autoOk={true}
                  floatingLabelText={t('common:startDate')}
                  shouldDisableDate={this.disableStartDate}
                  onChange={this.handleChangeStartDate}
                  value =  {this.state.startDate}    
                  data-tip data-for='click'
                />
                <ReactTooltip id='click' place="left" effect='solid'>
                  <span>{t('common:clickEdit')}</span>
                </ReactTooltip>
                <DatePicker
                  autoOk={true}
                  floatingLabelText={t('common:endDate')}
                  onChange = {this.handleChangeEndDate}
                  value =  {this.state.endDate}    
                  shouldDisableDate={this.disableEndDate}
                  data-tip data-for='click'
                />
                <ReactTooltip id='click' place="left" effect='solid'>
                  <span>{t('common:clickEdit')}</span>
                </ReactTooltip>
              </div>
              <div style={{display: 'inline-block'}}>
                <Hints 
                  increaseDay = {this.state.increaseDay}
                  avalableNumber = {this.state.avalableNumber.length}
                  currentInstanceNum = {this.props.currentInstanceNum}
                />
              </div>
            </div>
            <ReviewCalendar />
          </div>
        )
      case 1:
        return (
          <div>
            <ProjectCode 
              ProjectNum = {this.ChangeProjectNum}
              selectprojectNum = {this.state.selectprojectNum}
            />           
            <SelectField
              floatingLabelText={t('common:InstanceNum')}
              floatingLabelStyle={{color: orangeA700}}
              value={this.state.instanceNum}
              onChange={this.handleInstanceNumChange}
            >
              {this.state.avalableNumber.map((data) => (
                <MenuItem key={data.num+1} value={data.num+1} primaryText={data.num+1} />
              ))}           
            </SelectField>            
            <br />
            {this.state.instanceArr.map((instance, index)=>(
              <Card initiallyExpanded={true} style={{borderRadius: '5px', border:'1px solid #e0e0e0', margin: '2px'}}>
                <CardHeader
                  title={<b>Instance - {index}</b>}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <Divider />
                <CardText expandable={true}>
                <div>                
                  <SelectField
                    key = {instance.instance}
                    floatingLabelText={"Instance "+index+" "+t('common:instanceImage')}
                    onChange={this.imageSelect.bind(null, index)}
                    value={instance.image}
                  >
                    {this.state.imageArr.map((image,index)=>(
                      <MenuItem key={image.id} value={index} primaryText={image.name} />
                    ))}
                  </SelectField>
                  <br/>
                  <div>
                    <Card>
                      <CardHeader
                        subtitle={<p>{this.state.imageArr[instance.image].name} - {t('common:imageDesc')}</p>}
                      />
                      <CardText>
                        {instance.imageDesc}
                      </CardText>
                    </Card>
                  </div>
                </div>                
                </CardText>
              </Card>)
            )}
          </div>
        )
      case 2:
        return (
          <div>
          {loadingCreate ? <div style = {{textAlign:'center'}}><CircularProgress size={80} color={muiStyle.palette.primary1Color} thickness={5} /></div> :
            <ConfirmPage 
              increaseDay = {this.state.increaseDay}
              startDate = {this.state.startDate}
              endDate = {this.state.endDate}
              instanceArr = {this.state.instanceArr}
              imageArr = {this.state.imageArr}
              projectNum = {this.state.projectNum}
            />
          }
          </div>
        )
      default:
        return 'Fly Me To The Moon';
    }
  }
  CreateDone = () => {    
    this.props.refresh()
    this.props.switchReview()
  }
  renderContent() {
    const {finished, stepIndex, createdRespData} = this.state
    const contentStyle = {margin: '0 16px', overflow: 'hidden'}
    const {t} = this.props
    if (finished) {      
      return (
        <div style={contentStyle}>
          <List>                
            <Divider />
              <FinishPage data = {createdRespData} />
            <Divider />
            <RaisedButton 
              label={t('common:backReview')}
              backgroundColor = {muiStyle.palette.primary1Color}
              icon={<ImageViewComfy color = 'white'/>}
              labelColor = {white}
              onTouchTap={this.CreateDone}
            />
          </List>
        </div>
      )
    }
    let nextBtnDisable = false
    switch (stepIndex){
      case 0:
        nextBtnDisable = (this.state.increaseDay <= 0 || this.state.increaseDay > 31 || this.state.endDate === null || this.state.avalableNumber.length === 0)
        break
      // case 1:
      //   this.state.instanceArr.map((instance)=>{
      //     nextBtnDisable = (instance.dataSet === true && (instance.dataSetPath.length === 0 || instance.dataSetId.length === 0 || instance.dataSetPass.length === 0))
      //   })
      //   break
      }
    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label={t('common:createStep.back')}
            disabled={stepIndex === 0 || this.state.loadingCreate}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? t('common:createStep.create') : t('common:createStep.next')}
            backgroundColor = {muiStyle.palette.primary1Color}
            labelColor = {white}
            disabled={nextBtnDisable || this.state.loadingCreate}
            onTouchTap={this.handleNext}
          />          
        </div>
      </div>
    )
  }
  componentWillMount(){
    this.getImageApi()       
  }
  render() {
    const {loading, stepIndex, finished} = this.state
    const {t} = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Card>
          <CardActions style={{ 
            zIndex: 2, 
            display: 'inline-block', 
            float: 'right',
            right: '10px'
          }}>
            <FlatButton 
              label={t('common:specialOrder')}
              style = {finished ? {color:'white'} : {color:muiStyle.palette.primary1Color}}
              icon={<CommunicationContactMail />}
              disabled = {finished}
              href = {'mailto:eNgiNEer@No.oNe.cARe'}
              data-tip data-for='mailto'
            />
            <ReactTooltip id='mailto' place="bottom" effect='solid'>
              <span>{t('common:mailto')}</span>
            </ReactTooltip>
            <FlatButton 
              label={t('common:backReview')}
              style = {finished ? {color:'white'} : {color:muiStyle.palette.primary1Color}}
              icon={<ImageViewComfy />}
              disabled = {finished}
              onTouchTap={this.props.switchReview}
            />
          </CardActions>
          <CardTitle title={t('common:create')}/>
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>          
            <Stepper activeStep={stepIndex}>
              <Step>
                <StepLabel>{t('common:createStep.step1')}</StepLabel>
              </Step>
              <Step>
                <StepLabel>{t('common:createStep.step2')}</StepLabel>
              </Step>
              <Step>
                <StepLabel>{t('common:createStep.step4')}</StepLabel>
              </Step>
            </Stepper>
            <ExpandTransition loading={loading} open={true}>
              {this.renderContent()}
            </ExpandTransition> 
          </div>
        </Card>
      </MuiThemeProvider>
    )
  }
}
export default translate('')(CreatePage)