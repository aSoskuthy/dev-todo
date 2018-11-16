<template>
    
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>   
      <v-form ref="form">
        <v-alert outline 
         type="error" 
         :value="true" 
         style="border-radius: 3px;"
         v-if="userTasks.length === 0">
         You have to add tasks first. 
         Click <router-link :to="'/account'">here</router-link> to add tasks</v-alert> 
        <v-card class="pa-2">             
      
        <v-text-field 
        color="primary" 
        class="custom-height mb-4"
            :disabled="existingWorkItem.readOnly" 
            v-model="existingWorkItem.uniqueNumber"          
            label="PO Number"   
            outline>
         </v-text-field> 
         <transition name="fade">
            <v-text-field color="primary"  class="custom-height mb-4 mt-5"
            :disabled="existingWorkItem.readOnly" 
            v-model="existingWorkItem.description"
 
            label="Description"
                outline>
            </v-text-field> 
         </transition>
         <transition name="fade">        
            <v-list>         
             <v-chip 
             :class="areAllTasksFinished 
             ? 'white--text' 
             : 'black--text'" 
             :color="areAllTasksFinished
              ? 'primary' 
              : undefined"
              >{{ finishedTasks }} / {{ 3}}</v-chip>      
                <v-list-tile   
                v-for="item in existingWorkItem.tasks"
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
            <v-tooltip bottom>Update
            <v-btn  
                     
            :loading="isProcessing"
            slot="activator"      
            @click="update"              
            color="primary">
        <v-icon dark>save</v-icon>
    </v-btn>   
    </v-tooltip> 
    <v-tooltip  bottom>Add a note
    <v-btn  
    slot="activator"
    :disabled="isProcessing"   
    @click="notesDialog = true" 
    color="primary">
      <v-icon v-if="!existingWorkItem.notesMessage" dark>note_add</v-icon>
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
          v-model="existingWorkItem.notesMessage"></v-textarea>
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
import { mapGetters, mapActions } from 'vuex';
export default {
	props: {
		uniqueNumber: String
	},
	data() {
		return {
            isProcessing: false,            
			notesDialog: false,
			existingWorkItem: {
				id: null,
				userId: null,
				uniqueNumber: null,
				description: null,
				notesMessage: null,
				tasks: [],
				readOnly: true,
				date: null
			}
		};
	},
	computed: {
		...mapGetters({
			workItemById: 'workItemById',
			userTasks: 'userTasks'
		}),

		finishedTasks() {
			return this.existingWorkItem.tasks.filter(task => task.checked).length;
		},
		areAllTasksFinished() {
			return this.finishedTasks === this.existingWorkItem.tasks.length;
		}
	},
	methods: {
        ...mapActions({
            updateWorkItem: 'updateWorkItem'
        }),
		async update() {
            this.isProcessing = true
            let result = await this.updateWorkItem(this.existingWorkItem)            
            this.isProcessing = false     
            this.$router.push('/')       
        }
	},
	created() {
		let test = this.workItemById(this.uniqueNumber);
		this.existingWorkItem = {
			...this.existingWorkItem,
			...this.workItemById(this.uniqueNumber)
		};
	}
};
</script>

<style>
</style>
