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
            paddingVertical: 4,
            width: 180,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 2,
          },
        }}
      >
        {/* each option in the pop up menu */}
        <MenuOption onSelect={() => onRemove(item)}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: '14',
            }}
          >
            Remove from closet
          </Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default WardrobeRow;
