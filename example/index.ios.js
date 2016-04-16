import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';

import 'react-native-log';

console.log('app init');

console.log({complex: {obj: {really: 'deep'}}});

class example extends Component {
  constructor(props) {
    super(props);
    this.setState({bla: 'mitzi'});
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }
}

function showWarning(warning) {
  console.warn(warning);
  console.error('this is an example error');
}

setImmediate(() => showWarning('some warning'));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20
  },

});

AppRegistry.registerComponent('example', () => example);
