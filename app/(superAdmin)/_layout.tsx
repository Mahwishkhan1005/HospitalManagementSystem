<<<<<<< HEAD
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const _layout =() => {
  return (
    <Tabs>
      <Tabs.Screen
        name="adminhome"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color="#10B981" />
          ),
          tabBarLabel: 'Admin',
        }}
      />
    </Tabs>
  )
}
export default _layout;
=======
// import { Component } from "react";

// export class _layout extends Component {
//   // render() {
//   //   return (
//   //     <View>
//   //       <Text> textInComponent </Text>
//   //     </View>
//   //   );
//   // }
// }

// export default _layout;
>>>>>>> mahwish
