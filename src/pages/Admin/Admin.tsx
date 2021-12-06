import { IonAvatar, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLoading, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react"
import { useState } from "react";
import { firebaseFunction } from "../../services/firebase";
import { toast } from "../../toast";
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import './admin.css'
import NumberFormat from "react-number-format";
Chart.register(ArcElement);

const Admin : React.FC = () => {
    const [order, setOrder] = useState<Array<any>>([]);
    const [busy, setBusy] = useState<boolean>(false);
    const firebase = new firebaseFunction();
    let revenue = 0;

    useIonViewWillEnter(() => {
        getData();
    });

    async function getData() {
        setBusy(true);
        try {
            const categoryFirebase = firebase.getData("orders");
            setOrder(await categoryFirebase);
        } catch (e: any) {
            toast(e.message);
        }
        setBusy(false);
    }

    function getTotalRevenue() {
        order.forEach(element => {
            revenue += element.total;
        });
        return revenue;
    }

    function getTotalOrders() {
        return order.length;
    }

    function getDoneOrders() {
        let done = 0;
        order.forEach(element => {
            if (element.status === 0) {
                done++;
            }
        });
        return done;
    }

    function getDeliveringOrders() {
        let delivering = 0;
        order.forEach(element => {
            if (element.status === 1) {
                delivering++;
            }
        });
        return delivering;
    }

    function getProsesOrders() {
        let proses = 0;
        order.forEach(element => {
            if (element.status === 2) {
                proses++;
            }
        });
        return proses;
    }

    const doughnutChartData = {
        labels: ['Orders', 'Done'],
        datasets: [
          {
            label: 'Done Orders Percentage',
            backgroundColor: ['#00D100', '#808080'],
            borderColor: '#3B3B3B',
            borderWidth: 0.5,
            hoverOffset: 4,
            data: [getDoneOrders(), getTotalOrders() - getDoneOrders()]
          }
        ]
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>CMS Renebae</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonLoading message="Please wait..." duration={0} isOpen={busy} />
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">CMS Renebae</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        <IonCol size="6">
                            <IonCard className="ion-padding">
                                <Doughnut data={doughnutChartData}
                                    options={{ maintainAspectRatio: true}}   />
                            </IonCard>
                        </IonCol>
                        <IonCol size="6">
                            <IonCard className="ion-padding ion-text-center">
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle className="bigTextTitle">Order Completion</IonCardTitle>
                                </IonCardHeader>
                                {Math.round((getDoneOrders()/getTotalOrders())*100) < 60 ?
                                <IonText color="danger percentageBigText">
                                    {Math.round((getDoneOrders()/getTotalOrders())*100)}%
                                </IonText> : Math.round((getDoneOrders()/getTotalOrders())*100) < 80 ?
                                <IonText color="warning percentageBigText">
                                    {Math.round((getDoneOrders()/getTotalOrders())*100)}%
                                </IonText> :
                                <IonText color="success percentageBigText">
                                    {Math.round((getDoneOrders()/getTotalOrders())*100)}%
                                </IonText>}
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeSm="12" sizeMd="6">
                            <IonCard>
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle>Total Revenue</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className="ion-text-center">
                                    <IonTitle color="success">
                                    <NumberFormat
                                        thousandsGroupStyle="thousand"
                                        value={getTotalRevenue()}
                                        prefix="Rp "
                                        decimalSeparator=","
                                        displayType="text"
                                        type="text"
                                        thousandSeparator="."
                                        allowNegative={true}
                                    />
                                    </IonTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol sizeSm="12" sizeMd="6">
                            <IonCard>
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle>Total Orders</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className="ion-text-center">
                                    <IonTitle>
                                        {getTotalOrders()}
                                    </IonTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeSm="12" sizeMd="4">
                            <IonCard>
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle>Done Orders</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className="ion-text-center">
                                    <IonTitle color="success">
                                        {getDoneOrders()}
                                    </IonTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol sizeSm="12" sizeMd="4">
                            <IonCard>
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle>Delivering Orders</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className="ion-text-center">
                                    <IonTitle color="primary">
                                        {getDeliveringOrders()}
                                    </IonTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol sizeSm="12" sizeMd="4">
                            <IonCard>
                                <IonCardHeader className="ion-text-center">
                                    <IonCardTitle>Processing Orders</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className="ion-text-center">
                                    <IonTitle color="warning">
                                        {getProsesOrders()}
                                    </IonTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Admin;