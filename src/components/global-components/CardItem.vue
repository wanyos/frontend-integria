<template>
  <section class="card-container">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <div class="div__container">
      <h5>{{ props.title }}</h5>
      <h5 class="name__total">{{ props.count }}</h5>
    </div>
    <div v-if="props.emailResponse === null" class="div__container">
      <ButtonList title="Email To" :emails="props.emailsTo" @new-emails="updateEmailsTo" />
      <ButtonList title="Email Cc" :emails="props.emailsCc" @new-emails="updateEmailsCc" />
    </div>
    <div v-if="props.emailResponse === null" class="div__button">
      <button
        @click="handleClick"
        :disabled="props.emailsTo.length === 0"
        class="btn__send"
        :class="isDisabled"
      >
        Send
      </button>
    </div>

    <CardResponse v-if="props.emailResponse !== null" :email-response="props.emailResponse" />
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ButtonList from './ButtonList.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import CardResponse from './CardResponse.vue'

const emit = defineEmits(['button-click', 'update:newEmailsTo', 'update:newEmailsCc'])
const isLoading = ref(false)

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  count: {
    type: [String, Number],
    default: ''
  },
  emailsTo: {
    type: Array,
    default: () => []
  },
  emailsCc: {
    type: Array,
    default: () => []
  },
  emailResponse: {
    type: Object,
    default: () => null
  }
})

const isDisabled = computed(() =>
  props.emailsTo.length > 0 ? 'btn__send-enabled' : 'btn__send-disabled'
)

const handleClick = () => {
  isLoading.value = true
  emit('button-click')
}

const updateEmailsTo = emailsTo => {
  emit('update:newEmailsTo', emailsTo)
}

const updateEmailsCc = emailsCc => {
  emit('update:newEmailsCc', emailsCc)
}

watch(
  () => props.emailResponse,
  newValue => {
    if (newValue !== null) {
      isLoading.value = false
    }
  },
  { deep: true }
)
</script>

<style lang="css" scoped>
.card-container {
  border: 1px solid blue;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
}

.div__container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.container__response {
  grid-column: 1 / -1;
}

.name__total {
  margin-right: 3rem;
}

.div__button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn__send {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 4px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.btn__send:hover {
  background-color: var(--hover-button);
}

.btn__send-disabled {
  cursor: not-allowed;
  background-color: rgb(234, 238, 242);
}

.btn__send-disabled:hover {
  background-color: rgb(234, 238, 242);
}
</style>
