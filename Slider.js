/*
*	封装ViewPager
*/
'use strict';

var React = require('react-native');
var ViewPager = require('react-native-viewpager');



var {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Component,
	Image,
} = React;

var deviceWidth = Dimensions.get('window').width;


class Slider extends Component{
	constructor(props){
		super(props);
		this.state={
			dataSource: new ViewPager.DataSource({
      			pageHasChanged: (p1, p2) => p1 !== p2})
		};
	}
	componentDidMount(){
		this.setState({
			dataSource: this.state.dataSource.cloneWithPages(this.props.dataSource)
		});
	}
	
	_renderPage(data,pageId){
		console.log(data);
		return (
			<View style={styles.container}>
	      		<Image
	        		source={{uri: data.image}}
	        		style={styles.page}>
	        	<View style={styles.titleContainer}>	
	        		<Text style={styles.title}>{data.title}</Text>	
	        	</View>
	        	
	        	</Image>
	        </View>		
    		);
	}

	render(){
		return (
			<ViewPager
		        style={this.props.style}
		        dataSource={this.state.dataSource}
		        renderPage={this._renderPage}
		        isLoop={true}
		        autoPlay={true}/>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		
	},
	page: {
		height: 200,
		width: deviceWidth,
		

	},
	titleContainer: {
		flex: 1,
		padding: 20,
		
		
	},
  
	title: {
	    color: '#ffffff',
	    fontSize: 20,
	    fontWeight : 'bold',
	    position: 'absolute',
	    bottom: 20,
	    
	    //backgroundColor: 'transparent',
	  }
  
	
});

module.exports = Slider;