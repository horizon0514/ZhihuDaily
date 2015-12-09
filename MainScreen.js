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

let requestUrl = DataWarehouse.news;


// class MainScreen extends React.Component{
//   constructor(){//ES6 风格
//     super();
//     this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     return {
//       dataSource: this.ds.cloneWithRows([]),
//     };
//   }
//   componentDidMount(){
//     //this._fetchData();
//     this.setState({dataSource:this.ds.cloneWithRows(["Row 1", "Row 2", "Row 3", "Row 4"])});

//   }
  
//   _fetchData(){
//     fetch(requestUrl)
//       .then(response => response.json())
//       .then(response => {
//         console.log(response);
//         this.setState({
//           dataSource: this.ds.cloneWithRows(response.stories)
//         });
        
//       }
//     );//setState之后会自动调用render函数
//   }
//   renderRow(rowData, sectionID, rowID) {
//     console.log(rowData);
//     return (
//       <TouchableHighlight  underlayColor='#dddddd'>
//         <View>
//            <View style={styles.rowContainer}>
//              <Image style={styles.thumb} source={require('./img/splash.png')}/>
//              <View style={styles.textContainer}>
//               <Text style={styles.title}>{rowData.title}</Text>
//               <Text style={styles.desc}></Text>
//              </View>
//            </View>
//            <View style={styles.separator}/>
           
//         </View>
//       </TouchableHighlight>       

//     );
//   }
 
//   render() {
//     console.log('render listview');
//     return (
//       <View style={styles.container}>
//           <ListView
//             dataSource={this.state.dataSource}
//             renderRow={this.renderRow.bind(this)}/>
//       </View> 
//     );
//   }
// };
class MainScreen extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      isLoading : true
    }
    
    this.ds = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: this.ds.cloneWithRows([{images:[]}])
    };
  }
  componentDidMount(){
    this._fetchData();
    
  }
  
  _fetchData(){
    fetch(requestUrl)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({
          dataSource: this.ds.cloneWithRows(response.stories),
          isLoading: false
        });
        
      }
    );//setState之后会自动调用render函数
  }

  renderRow(rowData, sectionID, rowID) {
    console.log(rowData);
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
 
  render() {
    var spinner = <ActivityIndicatorIOS style={styles.centering} hidden='false' size='large'/>;
          
    if(this.state.isLoading){
      return(
        <View style={styles.container}>spinner</View>
        );
    } else {
      return (
        <View style={styles.container}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}/>
          </View> 
      );
    }
  }
 
}

var styles = StyleSheet.create({
  container: {
    flex: 1
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
});

module.exports = MainScreen;