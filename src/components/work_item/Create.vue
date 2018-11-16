<template>
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>   
      <v-form ref="form" v-model="isValidForm">
        <transition name="fade">
        <v-alert 
         v-if="existingWorkItemDescription && !disableAll" 
         class="mb-3" 
         outline 
         type="error"  
         style="border-radius: 3px"
         :value="true">
         Saving will overwrite an existing item "{{ existingWorkItemDescription }}"<br> 
         Load it instead? <router-link :to="'/edit/' + uniqueNumber">Click to Load</router-link> </v-alert> 
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
            :disabled="disableAll" 
            :append-icon="uniqueNumber ? 'done': undefined"
            :rules="uniqueNumberRules"           
            v-model="uniqueNumber"
            @input="findExistingWorkItem"
            counter="5"
            required
            maxlength="5"
            label="Enter PO Number"   
            outline>
         </v-text-field> 
         <transition name="fade">
            <v-text-field color="primary"  class="custom-height mb-4 mt-5"
            :disabled="disableAll"  
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
                    :disabled="disableAll"  
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
            <v-btn  
            slot="activator"         
            :disabled="disableAll"   
            @click="save" 
            dark 
            color="primary">
        <v-icon dark>save</v-icon>
    </v-btn>   
    </v-tooltip> 
    <v-tooltip  bottom>Add a note
    <v-btn 
    slot="activator" 
    :disabled="disableAll" 
    @click="notesDialog = true" 
    dark 
    color="primary">
      <v-icon v-if="!notesMessage" dark>note_add</v-icon>
      <v-icon v-else dark>edit</v-icon>
    </v-btn>
    </v-tooltip>
            </v-list>
          
         </transition>    
    <transition name="fade">
    <v-alert v-show="disableAll"
      class="alert-success"
      :disabled="disableAll" 
      color="success"
      icon="check_circle"
      outline
    >
      Item saved successfully
    </v-alert>
    </transition >
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
import { debounce } from "debounce"

export default {
	data() {
		return {
      existingWorkItemDescription: null,
			isValidForm: false,
			id: null,
			userId: null,
			uniqueNumber: null,
			description: null,
			notesDialog: false,
			notesMessage: null,
			tasks: [],
			disableAll: false,
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
		// existingWorkItemDescription() {
		// 	if (!isNaN(this.uniqueNumber)) {
		// 		const existingItem = this.workItems.find(
		// 			item => item.uniqueNumber === this.uniqueNumber
		// 		);
    //     if (existingItem)
    //      setTimeout(()=>{
    //        return existingItem.description;
    //      },1000)
         
		// 	}
		// },
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
			saveWorkItem: 'saveWorkItem'
    }),
    debounceInput: debounce(function(e){
      this.existingWorkItemDescription = null
         if (!isNaN(this.uniqueNumber)) {
				const existingItem = this.workItems.find(
					item => item.uniqueNumber === this.uniqueNumber
				);
        
        if (existingItem)         
           this.existingWorkItemDescription = existingItem.description;
         }
    },2000)
    ,  
    findExistingWorkItem(uniqueNumber) {
      this.existingWorkItemDescription = null
      this.debounceInput()
    },
		async commitSave() {
			this.disableAll = true;
			const workItem = {
				userId: this.currentUser.user.uid,
				uniqueNumber: this.uniqueNumber,
				description: this.description,
				tasks: this.tasks,
				notes: this.notesDialog,
				notesMessage: this.notesMessage,				
				date: new Date()
					.toJSON()
					.slice(0, 10)
					.replace(/-/g, '/')
			};

			await this.saveWorkItem(workItem);
      this.uniqueNumber = null
      this.$refs.form.reset()
			this.disableAll = false;
		},
		async save() {
			await this.commitSave();
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
