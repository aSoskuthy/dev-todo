<template>
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>   
      <v-form @submit.prevent ref="form" v-model="isValidForm">
        <transition name="fade">
        <v-alert 
         v-if="isExistingWorkItem" 
         class="mb-3" 
          outline
         type="info"  
         style="border-radius: 3px"
         :value="true">
          You are editing an existing item
         </v-alert> 
         </transition>
        <v-alert outline 
         type="error" 
         :value="true" 
         style="border-radius: 3px;"
         v-if="userTasks.length === 0">
         You have to add tasks first. 
         Click <router-link :to="'/account'">here</router-link> to add tasks</v-alert> 
        <v-card v-else class="pa-2">             
      
        <v-text-field 
        color="primary" 
        class="custom-height mb-4"
            :disabled="isProcessing" 
            :append-icon="uniqueNumber ? 'done': undefined"
            :rules="uniqueNumberRules"           
            v-model="uniqueNumber"
            @input="debounceInput"
            counter="5"
            
            maxlength="5"
            label="Enter PO Number"   
            outline>
         </v-text-field> 
         <transition name="fade">
            <v-text-field color="primary"  class="custom-height mb-4 mt-5"
            :disabled="isProcessing"  
            :append-icon="description ? 'done': undefined"
            :rules="descriptionRules"
            v-model="description"
            counter="50"
            maxlength="50"                      
            label="Enter description"
                outline>
            </v-text-field> 
         </transition>
         <transition name="fade">        
            <v-list v-if="isValidForm">         
             <v-chip 
             :class="areAllTasksFinished 
             ? 'white--text' 
             : 'black--text'" 
             :color="areAllTasksFinished
              ? 'primary' 
              : undefined"
              >{{ finishedTasks }} / {{ tasks.length }}</v-chip>      
                <v-list-tile   
                v-for="item in tasks"
                :key="item.id"                       
                >         
                <v-list-tile-avatar>
                    <v-checkbox 
                    :disabled="isProcessing"  
                    color="primary"  
                    v-model="item.checked"></v-checkbox>
                </v-list-tile-avatar>
                <v-list-tile-content>
                <v-list-tile-title  
                class="mt-1" 
                :class="{ 'task-finished': item.checked }" 
                v-text="item.text"></v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>
            <v-tooltip bottom>Save
            <v-btn  v-if="!isExistingWorkItem"
            slot="activator"         
            :loading="isProcessing"   
            @click="saveClicked('saveWorkItem')"              
            color="primary">
        <v-icon dark>save</v-icon>
            </v-btn>
            </v-tooltip> 
        <v-tooltip bottom>Overwrite
        <v-btn  v-if="isExistingWorkItem"
            slot="activator"         
            :loading="isProcessing"   
            @click="saveClicked('updateWorkItem')" 
            color="primary">
        <v-icon dark>save</v-icon>        
    </v-btn>  

    </v-tooltip> 
    <v-tooltip  bottom>Add a note
    <v-btn 
    slot="activator" 
    :disabled="isProcessing" 
    @click="notesDialog = true" 
    dark 
    color="primary">
      <v-icon v-if="!notesMessage" dark>note_add</v-icon>
      <v-icon v-else dark>edit</v-icon>
    </v-btn>
    </v-tooltip>
            </v-list>
          
         </transition>    

    <v-dialog
      v-model="notesDialog"
      max-width="870"
    >
      <v-card>
        <v-card-title class="headline">Enter your notes</v-card-title>
        <v-card-text>
           <v-textarea        
          v-model="notesMessage"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            flat="flat"
            @click="notesDialog = false"
          >
            Close
          </v-btn>         
        </v-card-actions>
      </v-card>
      
    </v-dialog>  
        </v-card>
          </v-form>
        </v-flex> 
    </v-layout>    
</v-container>

</template>

<script>
import db from '@/firebase';
import { mapActions, mapState } from 'vuex';
import { debounce } from 'debounce';

export default {
	data() {
		return {
			isProcessing: false,
			isExistingWorkItem: false,
			isValidForm: false,
			id: null,
			userId: null,
			uniqueNumber: null,
			description: null,
			notesDialog: false,
			notesMessage: null,
			tasks: [],
			date: null,
			uniqueNumberRules: [
				v => !!v || 'This field is required',
				v => (!!v && v.length <= 5) || 'Maximum 5 digits',
				v => !isNaN(v) || 'Must be a numeric value'
			],
			descriptionRules: [
				v => !!v || 'This field is required',
				v => (!!v && v.length <= 50) || 'Maximum 50 characters'
			]
		};
	},
	computed: {
		...mapState({
			userTasks: 'userTasks',
			currentUser: 'currentUser',
			workItems: 'workItems'
		}),
		areAllTasksFinished() {
			return this.finishedTasks === this.userTasks.length;
		},
		finishedTasks() {
			return this.tasks.filter(task => task.checked).length;
		}
	},
	methods: {
		...mapActions({
			fetchTasks: 'fetchTasks',
			fetchWorkItems: 'fetchWorkItems',
			saveWorkItem: 'saveWorkItem',
			updateWorkItem: 'updateWorkItem'
		}),
		debounceInput: debounce(function(e) {
     
			var existingItem;
			if (!isNaN(this.uniqueNumber)) {
				existingItem = this.workItems.find(
					item => item.uniqueNumber === this.uniqueNumber
				);
				if (existingItem) {
					console.log(existingItem.tasks[0].checked);
					this.isExistingWorkItem = true;
					this.description = existingItem.description;
					this.id = existingItem.id;
					this.tasks = existingItem.tasks;
					this.notesMessage = existingItem.notesMessage;
				} else {
					this.isExistingWorkItem = false;
					this.description = null;
					this.id = null;
					this.tasks = this.userTasks.map(x => ({ ...x }));
					this.notesMessage = null;
				}
			}
    }, 1000),
    async saveClicked(actionName){
      this.isProcessing = true;
      const workItem = this.mapToNewObject()
      await this.$store.dispatch(actionName, workItem)
      this.clearForm()
      this.isProcessing = false
    },
    mapToNewObject(){
      return {
        id: this.id,
        userId: this.currentUser.user.uid,
        uniqueNumber: this.uniqueNumber,
        description: this.description,
        tasks: this.tasks,
        notesMessage: this.notesMessage,
        date: new Date()
        	.toJSON()
					.slice(0, 10)
					.replace(/-/g, '/')
      }
    },
		clearForm() {
			  this.id = null
				this.userId = null
				this.uniqueNumber = null
				this.description = null
				this.notesMessage = null
				this.tasks = this.userTasks.map(x => ({ ...x }))
        this.isExistingWorkItem = false
        this.$refs.form.resetValidation()				
		}
	},
	created() {
		this.tasks = this.userTasks.map(x => ({ ...x }));
	}
};
</script>

<style scoped>
.custom-height {
	height: 53px;
}
.alert-success {
	border: 2px solid greenyellow;
	border-radius: 5px;
}
.white {
	color: white;
}
.black {
	color: black;
}
.task-finished {
	text-decoration: line-through;
}
</style>
