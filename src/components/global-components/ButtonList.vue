<template>
  <div class="card">
    <h5>
      {{ props.title }}
      <button v-if="props.emails.length > 0" @click="toggleTooltip" class="button__icon">
        <v-icon name="fa-plus-circle" animation="float" speed="slow" fill="#0088cc" />
      </button>
    </h5>

    <button class="email-button">
      <span v-for="(email, index) in displayedEmails" :key="index">
        {{ email }}<span v-if="index < displayedEmails.length - 1">, </span>
      </span>
      <span v-if="emailList.length > 2" class="more-text">...</span>
    </button>

    <Transition name="fade">
      <div v-if="showTooltip" class="tooltip">
        <div class="div__buttons">
          <button v-if="!isEditing" @click="toggleEditMode">Edit</button>
          <button v-if="isEditing" @click="saveChanges">Save</button>
        </div>

        <div v-for="(email, index) in emailList" :key="'tooltip-' + index" class="div__emails">
          <input
            type="text"
            v-model="editableEmailList[index]"
            :readonly="!isEditing"
            :class="{ 'editable-input': isEditing }"
            class="input__email"
          />

          <button v-if="isEditing" @click="removeEmail(index)" class="delete-button">×</button>
        </div>

        <div v-if="isEditing" class="add-email-container">
          <button @click="addNewEmail" class="add-email-button">+ Add new email</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['newEmails'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  emails: {
    type: Array,
    default: () => []
  }
})

const isEditing = ref(false)
const showTooltip = ref(false)
const displayedEmails = computed(() => emailList.value.slice(0, 2))
const emailList = ref([...props.emails])
const editableEmailList = ref([...emailList.value])

const toggleEditMode = () => {
  if (!isEditing.value) {
    editableEmailList.value = [...emailList.value]
  }
  isEditing.value = !isEditing.value
}

const saveChanges = () => {
  emailList.value = [...editableEmailList.value]
  emit('newEmails', emailList.value)
  isEditing.value = false
  showTooltip.value = !showTooltip.value
}

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
  if (!showTooltip.value) {
    isEditing.value = false
  }
}

const removeEmail = index => {
  editableEmailList.value.splice(index, 1)
}

const addNewEmail = () => {
  editableEmailList.value.push('')
}

watch(
  editableEmailList,
  newValue => {
    if (isEditing.value) {
      emailList.value = [...newValue]
    }
  },
  { deep: true }
)
</script>

<style lang="css" scoped>
.card h5,
.card .email-button {
  margin: 0;
}

.card {
  width: 15rem;
  border-radius: 5px;
  position: relative;
  background: white;
}

.div__emails {
  display: flex;
  align-items: center;
  margin: 0.5rem;
}

.button__icon {
  margin-left: 15px;
  cursor: pointer;
  padding: 1px;
}

.div__buttons {
  display: flex;
  justify-content: end;
  gap: 0.5rem;
}

.div__buttons button {
  cursor: pointer;
  border: 1px solid #fff;
  padding: 2px 3px;
}

h5 {
  text-align: center;
}

.email-button {
  background: linear-gradient(to right, white, rgba(255, 255, 255, 0.5));
  padding: 5px;
  cursor: pointer;
  text-align: left;
  position: relative;
}

.delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.add-email-container {
  margin-top: 15px;
}

.add-email-button {
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}

.more-text {
  font-weight: bold;
}

span {
  font-size: 12px;
}

.tooltip {
  position: absolute;
  font-size: 12px;
  top: 2rem;
  left: 0;
  width: min-content;
  background: var(--color-text);
  color: #fff;
  padding: 1rem;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.input__email {
  color: #fff;
  border-radius: 3px;
  padding: 5px;
  min-width: 15rem;
}

.input__email.editable-input {
  border: 1px solid #fff;
  cursor: text;
}
</style>
