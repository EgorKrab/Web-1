<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import Popper from 'vue3-popper'
import Icon from '@/components/Icon.vue'

import * as TASK from '@/store/actions/tasks'

// Statuses icons
import readyStatus from '@/icons/ready-status.js'
import note from '@/icons/note.js'
import inwork from '@/icons/inwork.js'
import pause from '@/icons/pause.js'
import canceled from '@/icons/canceled.js'
import improve from '@/icons/improve.js'
import repeat from '@/icons/repeat.js'

const props = defineProps({
  task: {
    type: Object
  }
})

const statusesLabels = [
  'status_not_begin',
  'status_ready',
  'task_by_link',
  'status_note',
  'status_in_work',
  'status_task_ready',
  'status_paused',
  'status_cancelled',
  'status_reject',
  'status_refine'
]

const statusColor = {
  4: 'text-green-600',
  5: 'text-red-600',
  8: 'text-red-600',
  9: 'text-blue-500'
}

const statuses = [
  undefined, // we don't have 0 status
  readyStatus,
  readyStatus,
  note,
  inwork,
  readyStatus,
  pause,
  canceled,
  canceled,
  improve
]

const store = useStore()
const isTaskStatusPopperActive = ref(false)
const isDark = computed(() => store.state.darkMode)
const localization = computed(() => store.state.localization.localization)
const colors = computed(() => store.state.colors.colors)

const toggleTaskStatusPopper = (val) => {
  isTaskStatusPopperActive.value = val
}

const showStatusOrNot = (type, status) => {
  if (type === 1 && [0, 1, 3, 4, 6, 7].includes(status)) {
    return true
  } else if (type === 2 && [0, 1, 3, 4, 6, 7, 9].includes(status)) {
    return true
  } else if (type === 3 && [0, 4, 5, 6, 8].includes(status)) {
    return true
  } else {
    return false
  }
}

const changeTaskStatus = (uid, status) => {
  store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: uid, value: status })
}

</script>

<template>
  <Popper
    arrow
    :class="isDark ? 'dark' : 'light'"
    placement="left"
    :disabled="props.task.type == 4"
    @click.stop="toggleTaskStatusPopper(true)"
    @open:popper="toggleTaskStatusPopper(true)"
    @close:popper="toggleTaskStatusPopper(false)"
  >
    <template #content="{ close }">
      <div class="flex flex-col">
        <div
          v-for="taskStatus in 10"
          :key="taskStatus"
          @click="close"
        >
          <div
            v-if="showStatusOrNot(props.task.type, taskStatus - 1) && props.task.status !== (taskStatus - 1)"
            class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
            @click="changeTaskStatus(props.task.uid, taskStatus - 1)"
          >
            <div
              class="border-2 border-gray-300 rounded-md mr-1 flex items-center justify-center"
              style="min-width:20px; min-height: 20px;"
            >
              <Icon
                v-if="statuses[taskStatus - 1]"
                :path="statuses[taskStatus - 1].path"
                :class="statusColor[taskStatus - 1] ? statusColor[taskStatus - 1] : 'text-gray-500 dark:text-gray-100'"
                :box="statuses[taskStatus - 1].viewBox"
                :width="statuses[taskStatus - 1].width"
                :height="statuses[taskStatus - 1].height"
              />
            </div>
            {{ localization[statusesLabels[taskStatus - 1]] }}
          </div>
        </div>
      </div>
    </template>
    <div
      class="relative border-2 border-gray-300 rounded-md mr-1 flex items-center justify-center mt-0.5"
      :class="{ 'cursor-pointer': [1, 2, 3].includes(props.task.type), 'cursor-not-allowed': props.task.type == 4 }"
      style="min-width:20px; min-height: 20px;"
    >
      <Icon
        v-if="statuses[props.task.status]"
        :path="statuses[props.task.status].path"
        :class="statusColor[props.task.status] ? statusColor[props.task.status] : 'text-gray-500 dark:text-gray-100'"
        :style="{ color: colors[props.task.uid_marker] ? colors[props.task.uid_marker].fore_color : '' }"
        :box="statuses[props.task.status].viewBox"
        :width="statuses[props.task.status].width"
        :height="statuses[props.task.status].height"
      />
      <Icon
        v-if="props.task.SeriesType !== 0"
        :path="repeat.path"
        class="text-blue-500 bg-white absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full"
        :box="repeat.viewBox"
        :width="repeat.width"
        :height="repeat.height"
      />
    </div>
  </Popper>
</template>
