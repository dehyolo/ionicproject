import { Component, ElementRef } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  constructor(private alertCtrl: AlertController, 
    private utilService: UtilService, 
    private actionSheetCrtl: ActionSheetController) {
    let tasksJSON = localStorage.getItem('tasksDb');

    if (tasksJSON != null) {
      this.tasks = JSON.parse(tasksJSON);
    }

    this.updateLocalStorage();
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'O que deseja fazer'
        },
        {
          name: 'taskTags',
          type: 'text',
          placeholder: 'TAGS (separadas por espaços)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Confirmar',
          handler: (form) => {
            console.log('Confirm Ok');
            this.add(form.taskToDo, form.taskTags);
          }
        }
      ]
    });

    await alert.present();
  }

  async add(taskToDo: string, tags : string) {
    if (taskToDo.trim().length < 1) {
      this.utilService.showToast('Informe o que deseja fazer!', 2000);
      return;
    }
    for(let i=0;i<this.tasks.length;i++){
      if(taskToDo.trim()==this.tasks[i].name){
        this.utilService.showToast('Essa tafera já está registrada!');
        return;
      }
    }
    this.utilService.showLoading();
    console.log(tags);

    let task = { name: taskToDo.trim(), done: false, tags: tags.trim().split(" ") }
    this.tasks.push(task);

    this.updateLocalStorage();
    this.utilService.hideLoading();
  }

  updateLocalStorage() {
    localStorage.setItem('tasksDb', JSON.stringify(this.tasks));
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCrtl.create({
      header: 'O QUE DESEJA FAZER?',
      buttons: [{
        text: task.done ? 'Tarefa não concluída' : 'Tarefa concluída',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          this.doneSwi(task);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked.');
        }
      }]
    });
    await actionSheet.present();
  }

  doneSwi(task: any){
    task.done = !task.done;
    this.updateLocalStorage();
  }

  removeTask(task: any) {
    const elementList = document.querySelectorAll('.listItem');
    let element : Element;
    for(let i=0;i<elementList.length;i++){
      if(elementList[i].children[0].children[0].children[0].textContent==task.name){
        element=elementList[i];
      }
    }
    this.utilService.showLoading();
    element.classList.add('animate__animated', 'animate__bounceOutLeft');
    console.log(element);
    element.addEventListener('animationend', () => {
      this.tasks = this.tasks.filter(taskArray => task != taskArray);
      this.updateLocalStorage();
    });
    this.utilService.hideLoading();
  }

  async showRemCon(task: any){
    const alert = await this.alertCtrl.create({
      header: 'Excluir tarefa?',
      subHeader: 'Tem deseja que deseja excluir essa tarefa?',
      message: 'Essa ação não pode ser desfeita!',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Confirm Ok');
            this.removeTask(task);
          }
        }
      ]
    })
    await alert.present();
  }
  
}
