/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var DataWarehouse = require('./DataWarehouse');

var {
  StyleSheet,
  ListView,
  TouchableHighlight,
  Text,
  View,
  Image,
  Component,
  ActivityIndicatorIOS,
} = React;




class MainScreen extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
      currentDay: 0,
      dataBlob: {},
      sectionId: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1,r2)=>r1 !== r2,
        sectionHeaderHasChanged: (s1,s2)=>s1!==s2
      }),
      loaded: false
    };
  }
  componentDidMount(){
    this._fetchData(this.state.currentDay);
    
  }
  
  
  _fetchData(date){
    var url = '';
    if(date===0){//第一次请求数据
      url = DataWarehouse.news;
    } else {
      url += DataWarehouse.before+date;
    }
    var tempDataBlob = this.state.dataBlob;
    var sectionId = this.state.sectionId;
    var dataBlob = this.state.dataBlob;
    
    fetch(url)
      .then(response => response.json())
      .then(response => {
        var date = response.date;
        var newDataBlob = {};
        var newSectionId = sectionId.slice();
        newSectionId.push(date);
        
        dataBlob[date] = response.stories;
        newDataBlob = JSON.parse(JSON.stringify(dataBlob));

        
        console.log(newSectionId);
        this.setState({
          currentDay: date,
          dataBlob: newDataBlob,
          sectionId: newSectionId,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(this.state.dataBlob,this.state.sectionId,null),
          loaded: true
        });
        
      })
      
      
    
  }
  
  renderRow(rowData, sectionID, rowID) {
    //console.log(rowData);
    return (
      <TouchableHighlight  underlayColor='#dddddd'>
        <View>
           <View style={styles.rowContainer}>
             <Image style={styles.thumb} source={{uri: rowData.images[0]}}/>
             <View style={styles.textContainer}>
              <Text style={styles.title}>{rowData.title}</Text>
              <Text style={styles.desc}></Text>
             </View>
           </View>
           <View style={styles.separator}/>
           
        </View>
      </TouchableHighlight>       

    );
  }
  renderSectionHeader(sectionData,sectionID){
    console.log(sectionID);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{sectionID}</Text>
      </View>  
    );
  }
  renderFooter(){
    return (
      <View>
        <ActivityIndicatorIOS
          animating={true}
          size={'large'} />
      </View>);
  }
  onEndReached(){
    //listview到达底部，需要继续fetchData
    //console.log(this.state.currentDay);
    this._fetchData(this.state.currentDay);

  }
  render() {
    
    var spinner = <ActivityIndicatorIOS style={styles.centering} hidden='false' size='large'/>;
          
    if(!this.state.loaded){
      console.log('render spinner');
      return(
        <View style={styles.container}>{spinner}</View>
        );
    } else {
      console.log('render listview');
      console.log(this.state.dataSource);
      return (
        <View style={styles.container}>
            <ListView
              dataSource={this.state.dataSource}
              renderSectionHeader={this.renderSectionHeader}
              renderFooter={this.renderFooter}
              onEndReached={this.onEndReached.bind(this)}
              renderRow={this.renderRow}/>
          </View> 
      );
    }
  }
 
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  rowContainer: {
      flexDirection: 'row',
      padding: 10
    },
  thumb:{
    width: 80,
    height: 80,
    marginRight: 10

  },
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  textContainer: {
    flex: 1
  },
  separator: {
      height: 1,
      backgroundColor: '#dddddd'
    },
    desc:{
      fontSize:14,
      color: '#666666'
    },
    centering: {
      position: 'absolute',
      left: 100,
      top: 200
    },
    section: {
      height: 10,
      backgroundColor: 'blue',
      flex: 1,
    },
    sectionText: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 12,
    }
});

module.exports = MainScreen;