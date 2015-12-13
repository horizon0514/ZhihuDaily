'use strict';
var React = require('react-native');
var dataWarehouse = require('./DataWarehouse');
var HTMLWebView = require('react-native-html-webview');

var {
	View,
	StyleSheet,
	Text,
	NavigatorIOS,
	Image,
	Component,
	WebView,
	ScrollView,
	Animated,
	ActivityIndicatorIOS,

} = React;

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
		var html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="'
          + css
          + '" /></head><body>' + body
          + '</body></html>';

		this.setState({
			loaded: true,
			message: '',
			html: html,
			image: image,
		});

	}

	render(){
		console.log('render story');
		
		if(this.state.loaded){
			var html = this.state.html;
			var image = this.state.image;
			return (
		    	<ScrollView>		
			      <View>
			      	<Image style={styles.headerImg} source={{uri: image}}/>
			        <HTMLWebView
			        	style={styles.content}
			            html={html}
			            autoHeight={true}
			            scalesPageToFit={true}
			        />
			       	
			      </View>
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