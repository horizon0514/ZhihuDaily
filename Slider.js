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
      		<Image
        		source={{uri: data.image}}
        		style={styles.page} />
    		);
	}

	render(){
		console.log('render slider');
		console.log(this.props);
		return (
			<ViewPager
		        style={{flex:1,height: 200}}
		        dataSource={this.state.dataSource}
		        renderPage={this._renderPage}
		        isLoop={true}
		        autoPlay={true}/>
		);
	}
}

var styles = StyleSheet.create({
	page: {
		height: 200,
		width: deviceWidth,

	},
	
});

module.exports = Slider;