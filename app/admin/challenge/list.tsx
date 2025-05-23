import { Datagrid, List, NumberField, ReferenceField, TextField, SelectField } from "react-admin";

export const ChallengeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="question" />
                <SelectField source="type" choices={[
                    { id: 'SELECT', name: 'Select' },
                    { id: 'ASSIST', name: 'Assist' }
                ]} />
                <ReferenceField source="lessonId" reference="lessons" />
                <NumberField source="order" />
            </Datagrid>
        </List>
    );
};