import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

const WardrobeRow = ({ item, onRemove, children }) => {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{ TriggerTouchableComponent: Pressable }}
        triggerOnLongPress
      >
        {children}
      </MenuTrigger>

      <MenuOptions // the whole pop up menu box
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            paddingVertical: 6,
          },
        }}
      >
        {/* each option in the pop up menu */}
        <MenuOption onSelect={() => onRemove(item)}>
          <Text style={{ padding: 12 }}>Remove from closet</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default WardrobeRow;
