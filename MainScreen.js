/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var DataWarehouse = require('./DataWarehouse');
var StoryView = require('./Story');
var Slider = require('./Slider');

var {
  StyleSheet,
  ListView,
  TouchableHighlight,
  Text,
  View,
  Image,
  Component,
  TabBarIOS,
  ActivityIndicatorIOS,
  StatusBarIOS,
} = React;




class MainScreen extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
      currentDay: 0,
      dataBlob: {},
      sectionId: [],
      sliderDataSource: null,
      dataSource: new ListView.DataSource({//DataSource 接受这四个参数，如果数据格式不是默认的，那么需要手动实现getRowData,getSectionHeaderData两个函数
        // getRowData: this.getRowData,
        // getSectionHeaderData: this.getSectionHeaderData,
        rowHasChanged: (r1,r2)=>r1 !== r2,
        sectionHeaderHasChanged: (s1,s2)=>s1!==s2
      }),
      loaded: false
    };
  }
  componentDidMount(){
    this._fetchData(this.state.currentDay);
    StatusBarIOS.setStyle(1);
    
  }
  
  
  _fetchData(date){
    var url = '';
    if(date===0){//第一次请求数据
      url = DataWarehouse.news;
    } else {
      url += DataWarehouse.before+date;
    }
    /*
    *  之前的dataBlob,dataBlob数据结构为
      {
        '20150101':{},//
        '201412231': {}
        ...
      }
      这里向dataBlob中添加新数据必须返回新的对象，否则dataSource无法判断是否更新了，也就不会渲染
    */
    var sectionId = this.state.sectionId;
    var dataBlob = this.state.dataBlob;
    
    fetch(url)
      .then(response => response.json())
      .then(response => {
        var date = response.date;
        //检查是否有topstories
        if(response.top_stories){
          this.state.sliderDataSource = response.top_stories;
        }
        var newDataBlob = {};
        var newSectionId = sectionId.slice();
        newSectionId.push(date);
        
        dataBlob[date] = response.stories;
        newDataBlob = JSON.parse(JSON.stringify(dataBlob));

        this.setState({
          currentDay: date,
          //sliderDataSource: response.top_stories||null,
          dataBlob: newDataBlob,
          sectionId: newSectionId,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(newDataBlob,newSectionId,null),
          loaded: true
        });
        
      })
      
      
    
  }
  rowPressed(id){
    //跳转到story页面
    this.props.navigator.push({
      name: '',
      component: StoryView,
      passProps: {storyId: id}
    });
  }
  
  renderRow(rowData, sectionID, rowID) {
    return (
        <TouchableHighlight  onPress={()=>this.rowPressed(rowData.id)} underlayColor='#dddddd'>
          <View>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{rowData.title}</Text>
                <Text style={styles.desc}></Text>
              </View>
              <Image style={styles.thumb} source={{uri: rowData.images[0]}}/>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>     

    );
  }
  renderSectionHeader(sectionData,sectionID){
    //sectionID ＝ 20140101
    var  dateStr = [sectionID.slice(0,4),'-',sectionID.slice(4,6),'-',sectionID.slice(6)].join('');
    var dateObj = new Date(dateStr);
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var days = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{month+'月'+day+'日 '+ days[dateObj.getDay()]}</Text>
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
    var slider = this.state.sliderDataSource? 
                  (<View style={styles.sliderContainer}>
                    <Slider style={styles.slider} dataSource={this.state.sliderDataSource}/>
                    </View>)
                  :(<View></View>);  
    if(!this.state.loaded){
      return(
        <View style={styles.container}>{spinner}</View>
        );
    } else {
      return (
          <View style={styles.container}>
              <View style={styles.header}></View>
              {slider}
              <ListView style={styles.listview}
                dataSource={this.state.dataSource}
                renderSectionHeader={this.renderSectionHeader.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached.bind(this)}
                renderRow={this.renderRow.bind(this)}/>
          </View>
        
      );
    }
  }
 
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    height: 20,
    backgroundColor: '0766C7',

  },
  rowContainer: {
      flexDirection: 'row',
      padding: 10
    },
  thumb:{
    width: 80,
    height: 60,
    marginRight: 10

  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold'
  },
  textContainer: {
    flex: 1
  },
  separator: {
      height: 1,
      backgroundColor: '#f5f5f5'
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
    height: 30,
    backgroundColor: '#0766C7',
    flex: 1,
  },
  sectionText: {
    color: '#ffffff',
    marginTop: 10,
    textAlign: 'center',

  },
  sliderContainer:{
    height: 700,
    flex: 1,
    //flexDirection: 'column',

  },
  slider:{
    height: 700,
  },
  listview:{
    marginTop: -150,
  }
});

module.exports = MainScreen;