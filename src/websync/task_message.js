import store from '@/store/index.js'
import { computed } from 'vue'

const selectedTask = computed(() => store.state.tasks.selectedTask)

export function createMessage (obj) {
  if ('uid_task' in obj && selectedTask.value && obj.uid_task === selectedTask.value.uid) {
    store.commit('CREATE_MESSAGE_REQUEST', obj.obj)
  }
}
