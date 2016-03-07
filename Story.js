'use strict';
var React = require('react-native');
var dataWarehouse = require('./DataWarehouse');

var {
	View,
	StyleSheet,
	Text,
	NavigatorIOS,
	Image,
	Component,
	WebView,
	ScrollView,
	Dimensions,
	Animated,
	ActivityIndicatorIOS,

} = React;
var WEBVIEW_REF = 'webview';

class Story extends Component{
	constructor(props){
		super(props);
		this.state={
			loaded: false
		};
		
	}

	componentDidMount(){
		console.log(this.props.storyId);
		//id为文章的id
		this._fetchData(this.props.storyId);
	}

	_fetchData(id){
		var url = dataWarehouse.story + id;
		fetch(url)
			.then(response => response.json())
			.then(json => this._handleResponse(json))
			.catch(err=>{
				this.setState({
					loaded: true,
					message: 'timeout'
				});
			});

	}

	_handleResponse(json){
		//handle the html
		
		var body = json.body;
		var image = json.image;
		var css = json.css[0];

		var headImg = '<img src="'+image+'" width="100%" height="200"/>'
		var html = body.replace('<div class="img-place-holder"></div>',headImg)+'<link href="'+css+'" rel="stylesheet"/>';

        console.log(html);
		this.setState({
			loaded: true,
			message: '',
			html: html,
			image: image,
		});

	}

	render(){
		console.log('render story');
		console.log(this.state.loaded);
		if(this.state.loaded){
			var html = this.state.html;
			var image = this.state.image;
			return (
		    	<ScrollView>
			        <WebView
			        	  ref={WEBVIEW_REF}
				          automaticallyAdjustContentInsets={false}
				          source={{html: html}}
				          style={styles.webview}
          				  //contentInset={{top:0,bottom:47}}

			        />
			   	</ScrollView>
	    	);
		} else {
			return (
		      <View>
		        <ActivityIndicatorIOS
		          animating={true}
		          size={'large'} />
		      </View>
		    );
		}
	}
}

var styles = StyleSheet.create({
	container:{
		flex: 1,
		padding: 5,
		marginTop: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	webview: {
		height: Dimensions.get('window').height,
	},
	
	headerImg: {
		//width: 320,
		height: 200,
		top: 0,
		right: 0,
		left: 0
	},
	
	content: {
	    flex: 1,
	    //marginTop: 36,
	},
});


module.exports = Story;