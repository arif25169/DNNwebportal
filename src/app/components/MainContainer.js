import React, { Component, PropTypes } from 'react'
//redux
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {closeNotify} from './Notify/actionNotify'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MenuItem from 'material-ui/MenuItem'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import Snackbar from 'material-ui/Snackbar'
import FontIcon from 'material-ui/FontIcon'
import Paper from 'material-ui/Paper'
import autoprefixer from 'material-ui/utils/autoprefixer'
import { Card, CardHeader,CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import ReviewTable from './ReviewTable'
import HistoryTable from './HistoryTable'
import FtpInfoModal from './FtpInfoModal'
import ChartContainer from './Charts/ChartContainer'
import Footer from './Footer'
import CreatePage from './CreatePage/CreatePage'
import Machines from './Charts/Machines'
import TutorialBtn from './TutorialBtn'
//ICON
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new'
import SocialPerson  from 'material-ui/svg-icons/social/person'
import AnalysisIcon from 'material-ui/svg-icons/action/assessment'
import ImageViewComfy from 'material-ui/svg-icons/image/view-comfy'
import DeviceStorage from 'material-ui/svg-icons/device/storage'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionHistory from 'material-ui/svg-icons/action/history'
import MachineIcon from 'material-ui/svg-icons/action/dns'
import ImagePictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf'
// COLOR
import { greenA700, lightBlue500, lightBlue900 } from 'material-ui/styles/colors'
// i18n
import { translate, Interpolate } from 'react-i18next'
import i18n from '../utils/i18n'
import {DnnLogo_yellow} from '../image/imageBase64'
// API call
import axios from 'axios'
import {API_GetInfo} from '../resource'

const styles = {
	container: {
	    textAlign: 'center',
	    paddingTop: 0,
	},
	wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    bodySmall: {
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    contentSmall: {
        flex: 1,
        paddingTop: '3em',
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    }
}
const MenuStyles = {
    sidebarOpen: {
        flex: '0 0 16em',
        marginLeft: 0,
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
    sidebarClosed: {
        flex: '0 0 16em',
        marginLeft: '-16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
}
const styleSnackbar = {
  notifyError:{backgroundColor: '#ff405c'},
  notifyCopy:{backgroundColor: lightBlue900, textAlign:'center'},
  notifyClose:{backgroundColor: '#ffffff', opacity: .01} // make when close is transparent
}
const prefixedStyles = {}
const muiTheme = getMuiTheme({userAgent: 'all'})

if (!prefixedStyles.main) {
    // do this once because user agent never changes
    const prefix = autoprefixer(muiTheme)
    prefixedStyles.wrapper = prefix(styles.wrapper)
    prefixedStyles.main = prefix(styles.main)
    prefixedStyles.body = prefix(styles.body)
    prefixedStyles.bodySmall = prefix(styles.bodySmall)
    prefixedStyles.content = prefix(styles.content)
    prefixedStyles.contentSmall = prefix(styles.contentSmall)
}
/**
  MainContainer
  Example:
  ```
  <MainContainer 
    user={localStorage.getItem('itriUser')} 
    token={localStorage.getItem('token')} 
    SignOut={this.handleSignOut}
  />
  ```
 */
class MainContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      open: (localStorage.getItem('itriUser')=== 'A40503' && (this.props.admin > 6)),
      content: '',
      notifyOpen: false,
      notifyMsg:'',
      notifyCopy:false,
      data:''
    }
  }
  static propTypes = {
    /**
      The username 
    */
    user: React.PropTypes.string.isRequired,
    /**
      The user token for call api
    */
    token: React.PropTypes.string.isRequired,    
    /**
      the SignOut function
    */
    SignOut: React.PropTypes.func.isRequired,
  }  
  handleToggle = () => {
    if(localStorage.getItem('itriUser')=== 'A40503' && (this.props.admin > 6)){
      this.setState({
        open: !this.state.open,
      })
    }   
  }

  handleMenuTap = (value) => {
    // console.log(value)    
    this.setState({
      content: value
    })
  }
  handleTouchTap = () => {
    this.setState({
      open: true,
    })
  }
  // handleNotify = (msg, notifyCopy = false) => {
  //   this.setState({
  //     notifyOpen: true,
  //     notifyMsg: msg,
  //     notifyCopy: notifyCopy
  //   })
  //   // setTimeout(console.log('handleNotify'), 5400)
  // }
  // closeNotify = () => {
  //   console.log('closeNotify')
  //   this.setState({
  //     notifyOpen: false,      
  //   })
  // }
  getData = () => {
    axios.get(
        API_GetInfo,
        {
          headers: {'X-Access-Token': this.props.token, 'Accept': 'application/json'},
          params: { mode: 'booked' }
        }
      )
      .then((result)=>{
        console.log(result.data.schedules)
        this.dummyAsync(()=>
          this.setState({
            data: result.data.schedules
          })
        )
      }).catch((err)=>{
        console.log(err) 
      })
  }
  selectItem = (value) =>{
      switch(value){
        case 0:
          return (
                  <div>
                    <ReviewTable token = {this.props.token} />
                    <HistoryTable token = {this.props.token} />
                  </div>
                 )
          break
        case 1:
          return (<ReviewTable token = {this.props.token} />)
          break
        case 2:
          return (<HistoryTable token = {this.props.token} />)
          break
        case 3:
          return (
                    <CreatePage 
                      switchReview={()=> this.handleMenuTap(1)}
                      refresh = {this.getData}
                      currentInstanceNum={this.state.data.length}
                      notify = {this.handleNotify}
                      token={this.props.token}
                    />
                  )
          break
        case 4:
          return (<Card><CardText></CardText></Card>)
          break
        case 5:
          return (<ChartContainer />)
          break
        case 6:
          return (<div><Machines /></div>)
          break
        default:
          return (
                  <div>
                    <ReviewTable token = {this.props.token} />
                    <HistoryTable token = {this.props.token} />
                  </div>
                 )
      }
  }

  render(){ 
      const {t} = this.props

  		return(
	   		<MuiThemeProvider muiTheme={muiTheme}>		   		
	            <div style={prefixedStyles.wrapper}>
                    <div style={prefixedStyles.main}>
                        <AppBar 
                          title={
                            <span>
                              <img style={{height:32, width:64, verticalAlign:'middle'}} src={DnnLogo_yellow}/>
                                <b> DNN Web portal</b>
                            </span>
                          }
                          style={{ backgroundColor: lightBlue900 }}
        				          onLeftIconButtonTouchTap={this.handleToggle}
                          iconElementRight={
                            <div>
                              <span style={{display: 'inline-block',verticalAlign: 'super'}}>
                              <div>
                              <TutorialBtn />
                              </div>        
                              </span>
                              <span style={{display: 'inline-block',verticalAlign: 'super'}}>
                              <FtpInfoModal iconColor={'#FF3D00'}/>
                              </span>
                              <span style={{display: 'inline-block',verticalAlign: 'sub'}}>
                              <SocialPerson color='white'/>
                              </span>
                              <span style={{verticalAlign:'text-bottom'}}><b><font size={3} color='#FDD100'> {this.props.user}</font></b></span>
                              <span style={{verticalAlign:'sub'}}>
                              <IconButton 
                                tooltip={t('common:signOut')} 
                                onTouchTap={() => this.props.SignOut()}>                           
                              >
                                <ExitIcon color='white'/>
                              </IconButton>
                              </span>                              
                            </div>
                          }
        				        />
                        <div className="body" style={prefixedStyles.body}>
                            <div style={prefixedStyles.content}>
                              {this.selectItem(this.state.content)}
                              <Snackbar
                                open = {this.props.notify.isOpen}
                                autoHideDuration = {this.props.notify.error ? 2500 : 800}
                                message={this.props.notify.msg}
                                onRequestClose = {this.props.closeNotify}
                                bodyStyle={
                                  (!this.props.notify.error && this.props.notify.error!=null) ? 
                                  styleSnackbar.notifyCopy : 
                                  ((this.props.notify.error && this.props.notify.error!=null) ? 
                                  styleSnackbar.notifyError : styleSnackbar.notifyClose)
                                }
                                action={ this.props.notify.error && <FlatButton href={'mailto:eNgiNEer@No.oNe.cARe'} style={{color:'white'}}>Tell us</FlatButton>}
                              />
                            </div>
                            <Paper
                              style={this.state.open ? MenuStyles.sidebarOpen : MenuStyles.sidebarClosed}                      
                            >
                              <MenuItem
                               primaryText={'Dashboard'}
                               onTouchTap={() => this.handleMenuTap(0)}
                               />
                              <MenuItem
                               leftIcon={<ImageViewComfy />}
                               primaryText={t('common:menu.info')}
                               onTouchTap={() => this.handleMenuTap(1)}
                              />
                              <MenuItem
                               leftIcon={<ActionHistory />}
                               primaryText={t('common:menu.history')}
                               onTouchTap={() => this.handleMenuTap(2)}
                              />
                              <MenuItem
                               leftIcon={<ContentAdd />}
                               primaryText={t('common:menu.create')}
                               onTouchTap={() => this.handleMenuTap(3)}
                              />
                              <MenuItem
                               leftIcon={<ImagePictureAsPdf />}
                               primaryText={t('common:tutorial')}
                               onTouchTap={()=>displayPDF(localStorage.getItem('itriUser'))}
                              />                             
                            { 
                              (localStorage.getItem('itriUser') === 'A40503' && (this.props.admin > 6)) &&
                              <div>
                              <MenuItem
                               leftIcon={<AnalysisIcon />}
                               primaryText={t('common:menu.charts')}
                               onTouchTap={() => this.handleMenuTap(5)}
                              />
                              <MenuItem
                               leftIcon={<MachineIcon />}
                               primaryText={t('common:menu.machine')}
                               onTouchTap={() => this.handleMenuTap(6)}
                              />
                              </div>
                            }
                              <MenuItem
                               leftIcon={<ExitIcon />}
                               primaryText={'SignOut'}
                               onTouchTap={() => this.props.SignOut()}
                              />
                            </Paper>                            
                        </div>
                        <Footer/>
                    </div>
                </div>
	        </MuiThemeProvider>
        )
  }
}

function mapStateToProps(state) {
    return {
        notify: state.notify,
        admin: state.admin
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({closeNotify: closeNotify}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(translate('')(MainContainer))