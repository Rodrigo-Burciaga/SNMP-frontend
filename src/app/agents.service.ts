import {Agent} from './models/agent';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

interface Resp {
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  uri = 'http://0.0.0.0:5000';
  agentes: Agent[];
  agent: Agent;
  id_agent;

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<any> {
    return this.http.post<Resp>(`${this.uri}/get_all_instances`, null);
  }

  getMetric(oid: string): Observable<any> {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
    this.agent = this.agentes.find(a => a.id_agent === this.id_agent);

    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('ip', this.agent.ip);
    formData.append('community_string', 'public');
    formData.append('oid', oid);
    formData.append('id_agent', this.agent.id_agent.toString());

    return this.http.post<Resp>(`${this.uri}/get_snmp`, formData);
  }

  addAgent(ag: Agent): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('name', ag.name);
    formData.append('port', ag.port);
    formData.append('community_string', 'public');
    formData.append('ip', ag.ip);

    return this.http.post<Resp>(
      `${this.uri}/generate_instance_agent`,
      formData,
    );
  }

  updateAgent(oid: string, value: string): Observable<any> {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
    this.agent = this.agentes.find(a => a.id_agent === this.id_agent);

    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    // formData.append('port', this.agent.port);
    formData.append('community_string', 'private');
    formData.append('ip', this.agent.ip);
    formData.append('oid', oid);
    formData.append('value', value);

    return this.http.post<Resp>(`${this.uri}/set_snmp`, formData);
  }

  getProcessesHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_processes/${time}`, formData);
  }

  getRamHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_ram/${time}`, formData);
  }

  getDiskHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_disk/${time}`, formData);
  }

  getMemoryHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_memory/${time}`, formData);
  }

  getLoadHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_load/${time}`, formData);
  }

  getCPUHistory(time: string) {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('id_agent', this.agent.id_agent.toString());
    return this.http.post<Resp>(`${this.uri}/get_cpu/${time}`, formData);
  }
}
