<template>
  <div v-if="selectedChat" class="message-input">
    <input
        v-model="textMessage"
        @keyup.enter="send"
        placeholder="Введите сообщение..."
    />
    <button @click="send" class="send-btn">Отправить</button>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import type {  SendMessage } from '../../../types/Chat';
import { sendMessage } from '../../../socket/service.ts';
import { useChatStore } from "../../../store/ChatStore.ts";
import { useMessagesStore } from '../../../store/MessagesStore.ts'

const chatStore = useChatStore()
const messagesStore= useMessagesStore()
const selectedChat = computed(() => chatStore.chatRoom);

const textMessage = ref('');

const send = async () => {
  if (!textMessage.value.trim()) {
    console.warn('Нельзя отправить пустое сообщение');
    return;
  }

  if (!selectedChat.value?.id) {
    console.error('Chat is not selected');
    return;
  }

  const message: SendMessage = {
    content: textMessage.value,
    conversationId: selectedChat.value.id,
  };

  textMessage.value = '';

  try {
    await sendMessageToRoom(message);
    const savedMessage = await messagesStore.createMessage(message);
    messagesStore.messages.push(savedMessage);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
};


const sendMessageToRoom = async (message: SendMessage) => {
  try {
    const response = await sendMessage(message);
    console.log('Message sent successfully:', response);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

</script>

<style scoped>
.message-input {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background: #f4f7f9;
}

.message-input input {
  flex: 1;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease;

  &:focus{
    border-color: #1a73e8;
    outline: none;
  }
}

.send-btn {
  padding: 15px 20px;
  margin-left: 10px;
  background-color: #20282e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover{
    background-color: #2f444f;
  }
}

.custom-file-upload {
  position: relative;
  display: inline-block;
  padding: 10px 13px;
  margin-right: 10px;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s ease-out;
  width: 40px;
  height: 40px;
}

.custom-file-upload .file-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

.custom-file-upload .paperclipIcon {
  color: #68696e;
  cursor: pointer;
}

.custom-file-upload .paperclipIcon:hover {
  color: #212121;
}

.uploaded-file-preview {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

}

.preview-image, .preview-video {
  max-width: 80px;
  max-height: 80px;
  border-radius: 5px;
  object-fit: cover;
}

.preview-video {
  filter: none;
}

.preview-file {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}

.file-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.preview-file span {
  font-size: 0.9em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.remove-file-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 4px;
  background-color: #333;
  border: none;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>