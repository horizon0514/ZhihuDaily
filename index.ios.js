/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var DataWarehouse = require('./DataWarehouse');
var MainScreen = require('./MainScreen');

var {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  Image,
  Animated,
  Dimensions,
  View,
  NavigatorIOS,
} = React;

let requestUrl = DataWarehouse.cover;
let WINDOW_WIDTH = Dimensions.get('window').width;


var RNZhihuDaily = React.createClass({
  getInitialState: function(){//ES6 风格
    return {
      cover: null,
      bounceValue: new Animated.Value(1),
      splashed: false  //表示没有显示过splash image
    };
  },
  componentDidMount: function(){
    this._fetchCoverImg();

    this.state.bounceValue.setValue(1);     // Start large
    Animated.timing(
      this.state.bounceValue,
      {
        toValue: 1.2,
        duration: 5000,
      }
    ).start();
    
  },
  
  _fetchCoverImg: function(){
    fetch(requestUrl)
      .then(response => response.json())
      .then(response => this._handleImg(response));//setState之后会自动调用render函数
  },
  _handleImg: function(response){
    console.log(response);
    this.setState({
      cover: {
          url: response.img,
          text: response.text
        }

    });  
    
  
    //定时器，定时2秒进入listView
    setTimeout(()=>{
      this.setState({
        splashed: true
      });
    },1000)  
  },
  _renderScreen: function(route,navigator){
    return (
      <View style={styles.container}>
        <MainScreen navigator={navigator}/>
      </View>  
      );
  },
  render: function(){
    var source,text;
    console.log("state="+this.state);
    if(this.state.cover){
      source = {uri:this.state.cover.url};
      text = this.state.cover.text;
    } else {
      source = require('./img/splash.png');
      text = '';
    }
    if(this.state.splashed){
       return (
        <Navigator
          initialRoute={{name: 'MainScreen', component: MainScreen}}
          // configureScene={() => {
          //     return Navigator.SceneConfigs.FloatFromRight;
          // }}
          renderScene={(route, navigator) => {
            
            /*
            * navigator的使用方法
            * http://stackoverflow.com/questions/29335523/react-native-custom-navigation-with-navigator-component
            * 但是又有点不同，必须这样，否则后面navigator传不了props
            * https://github.com/facebook/react-native/issues/1103
            *  
            */
            if (route.component) {
              var Component = route.component;
              return (<View style={{flex: 1}}>
                        <Component navigator={navigator} route={route} {...route.passProps}/>
                      </View>);
            }
          }}
        />);

    } else {
      return (
        <View style={styles.container}>
          <Animated.Image 
            source = {source}
            style={{
              flex: 1,
              width: WINDOW_WIDTH,
              height: 1,
              transform: [
                {scale: this.state.bounceValue},
              ],

            }}
          />
          <Image source={require('./img/splash_logo.png')} style={styles.logo}/>
        </View>
      );
    }
    
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

    
    
  },
  logo: {
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 30,
    width: 54,
    left: 150,
    right: 0,
    backgroundColor: 'transparent'
  }
  
});

AppRegistry.registerComponent('RNZhihuDaily', () => RNZhihuDaily);
