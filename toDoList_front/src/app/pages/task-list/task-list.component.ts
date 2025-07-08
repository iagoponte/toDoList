import { Component, OnInit } from '@angular/core';
import { Task } from '../../interface/task';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ModalEditComponent } from '../../components/modal-edit/modal-edit.component';

@Component({
  selector: 'app-task-list',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  dataSource = new MatTableDataSource<Task>([]);
  tarefas: Task[] = [];
  colunas: string[] = ['titulo', 'descricao', 'concluida', 'acoes'];
  formTarefa!: FormGroup;

  novoTitulo: string = '';
  novaDescricao: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private localStorage: LocalstorageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  atualizarLocalStorage(): void {
    this.localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
  }

  ngOnInit(): void {
    this.formTarefa = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
    });
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.taskService.getTasks().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.dataSource.data = [...this.tarefas];
        this.atualizarLocalStorage();
      },
      error: (err) => console.error('Erro ao carregar tarefas', err),
    });
  }

  adicionarTarefa(): void {
    if (this.formTarefa.invalid) {
      this.formTarefa.markAllAsTouched(); 
      return;
    }

    const novaTarefa: Partial<Task> = {
      titulo: this.formTarefa.value.titulo,
      descricao: this.formTarefa.value.descricao,
    };

    this.taskService.createTask(novaTarefa).subscribe({
      next: (res) => {
        this.tarefas.push(res);
        this.dataSource.data = [...this.tarefas];
        this.dataSource.paginator = this.paginator;
        this.atualizarLocalStorage();
        this.formTarefa.reset();
        this.toastr.success('Tarefa adicionada com sucesso!', 'Sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      },
      error: (err) => {
        console.error('Erro ao adicionar tarefa', err),
          this.toastr.error('Erro ao adicionar tarefa.', 'Erro');
      },
    });
  }

  atualizarStatus(tarefa: Task): void {
    const atualizada = { ...tarefa, concluida: !tarefa.concluida };

    this.taskService.updateTask(tarefa.id, atualizada).subscribe({
      next: () => {
        tarefa.concluida = atualizada.concluida;
        this.atualizarLocalStorage();
        this.dataSource.data = [...this.tarefas];
      },
      error: (err) => {
        console.error('Erro ao atualizar status', err),
          this.toastr.error('Erro ao atualizar status.', 'Erro');
      },
    });
  }

  excluirTarefa(id: number): void {
    this.dialog
      .open(ModalComponent, {
        data: {
          titulo: 'Confirmar exclusão',
          mensagem: 'Tem certeza que deseja excluir esta tarefa?',
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (confirmado !== true) return;
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.tarefas = this.tarefas.filter((t) => t.id !== id);
            this.toastr.success('Tarefa excluída com sucesso!', 'Sucesso');
          },
          error: (err) => {
            console.error('Erro ao excluir tarefa', err),
              this.toastr.error('Erro ao excluir tarefa.', 'Erro');
          },
        });
      });
  }

  excluirTodas(): void {
    this.dialog
      .open(ModalComponent, {
        data: {
          titulo: 'Confirmar exclusão de todas as tarefas',
          mensagem:
            'Tem certeza que deseja excluir todas as tarefas? Esta ação é irreversível.',
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (confirmado !== true) return;

        this.taskService.deleteAll().subscribe({
          next: () => {
            this.tarefas = [];
            this.dataSource.data = [];
            this.atualizarLocalStorage();
            this.toastr.success(
              'Todas as tarefas foram excluídas com sucesso!',
              'Sucesso'
            );
          },
          error: (err) => {
            console.error('Erro ao excluir todas as tarefas', err),
              this.toastr.error('Erro ao excluir todas as tarefas.', 'Erro');
          },
        });
      });
  }

  exportarCSV(): void {
    this.taskService.exportCSV().subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'tarefas.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Arquivo CSV exportado com sucesso!', 'Sucesso');
      },
      error: (err) => {
        console.error('Erro ao exportar CSV', err),
          this.toastr.error('Erro ao exportar CSV.', 'Erro');
      },
    });
  }

  editarTarefa(tarefa: Task): void {
    this.dialog
      .open(ModalEditComponent, {
        data: { ...tarefa },
        width: '400px',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (!resultado) return;

        const tarefaAtualizada = { ...tarefa, ...resultado };

        this.taskService.updateTask(tarefa.id, tarefaAtualizada).subscribe({
          next: () => {
            this.tarefas = this.tarefas.map((t) =>
              t.id === tarefa.id ? tarefaAtualizada : t
            );
            this.dataSource.data = [...this.tarefas];
            this.atualizarLocalStorage();
            this.toastr.success('Tarefa atualizada com sucesso!', 'Sucesso');
          },
          error: (err) => {
            console.error('Erro ao atualizar tarefa', err);
            this.toastr.error('Erro ao atualizar a tarefa.', 'Erro');
          },
        });
      });
  }
}
